/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
'use client';
import { Client, IMessage } from '@stomp/stompjs';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';

import { useAuthGuard } from '@/api/auth-api';

interface WebSocketContextProps {
  isConnected: boolean;
  client: Client | null;
  sendMessage: (destination: string, payload: any) => void;
  notifications: string[];
  hasNewNotification: boolean;
  markNotificationsAsRead: () => void;
}

const WebSocketContext = createContext<WebSocketContextProps>({
  isConnected: false,
  client: null,
  sendMessage: () => {},
  notifications: [],
  hasNewNotification: false,
  markNotificationsAsRead: () => {},
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    if (!user) return;

    const socketURL = 'http://localhost:8080/ws'; // update this URL as needed
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketURL),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log('STOMP connection established');
        setIsConnected(true);

        // Subscribe to notifications channel
        stompClient.subscribe('/user/topic/notifications', (message: IMessage) => {
          console.log('Received notification:', message.body);
          // Update your notifications state (parsing message.body if needed)
          setNotifications((prev) => [...prev, message.body]);
          setHasNewNotification(true);
        });

        // (Optional) Add other subscriptions here as needed.
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
        console.error('Details:', frame.body);
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

  const sendMessage = (destination: string, payload: any) => {
    const client = clientRef.current;
    if (!client || !client.connected) {
      console.error('STOMP client is not connected.');
      return;
    }
    client.publish({
      destination,
      body: JSON.stringify(payload),
    });
  };

  const markNotificationsAsRead = () => {
    setHasNewNotification(false);
    // Optionally, clear or archive notifications here.
  };

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        client: clientRef.current,
        sendMessage,
        notifications,
        hasNewNotification,
        markNotificationsAsRead,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
