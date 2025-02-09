/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
'use client';

import { Client, IMessage } from '@stomp/stompjs';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { useAuthGuard } from '@/api/auth-api';

export interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
}

interface WebSocketContextProps {
  isConnected: boolean;
  client: Client | null;
  sendMessage: (destination: string, payload: unknown) => void;
  notifications: Notification[]; // notifications received via WebSocket
  newNotificationCount: number;
  markNotificationsAsRead: () => void;
}

const WebSocketContext = createContext<WebSocketContextProps>({
  isConnected: false,
  client: null,
  sendMessage: () => {},
  notifications: [],
  newNotificationCount: 0,
  markNotificationsAsRead: () => {},
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!user) return;

    const socketURL = 'http://localhost:8080/ws'; // update as needed
    console.log('Initializing STOMP client at', socketURL);

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketURL),
      reconnectDelay: 5000,
      debug: (msg) => console.log('STOMP Debug:', msg),
      onConnect: () => {
        console.log('STOMP connection established');
        setIsConnected(true);

        // Subscribe to the notifications channel.
        stompClient.subscribe('/user/topic/notifications', (message: IMessage) => {
          console.log('Received notification:', message.body);
          try {
            const notif: Notification = JSON.parse(message.body);
            setNotifications((prev) => [...prev, notif]);
            // Increment the counter so that every new notification triggers a refetch.
            setNewNotificationCount((prev) => prev + 1);
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message'], frame.body);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      console.log('Deactivating STOMP client...');
      stompClient.deactivate();
    };
  }, [user]);

  const sendMessage = (destination: string, payload: unknown) => {
    if (!clientRef.current || !clientRef.current.connected) {
      console.error('STOMP client is not connected.');
      return;
    }
    clientRef.current.publish({
      destination,
      body: JSON.stringify(payload),
    });
  };

  // Reset the new notification counter (e.g., after the user views them).
  const markNotificationsAsRead = () => {
    setNewNotificationCount(0);
  };

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        client: clientRef.current,
        sendMessage,
        notifications,
        newNotificationCount,
        markNotificationsAsRead,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);