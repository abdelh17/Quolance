/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
'use client';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import httpClient from '@/lib/httpClient';
import { useAuthGuard } from '@/api/auth-api';
import { useUpdateNotificationSubscription } from '@/api/notifications-api';

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
  notifications: Notification[];
  newNotificationCount: number;
  markNotificationsAsRead: () => void;
  subscribed: boolean;
  subscribeToNotifications: () => Promise<void>;
  unsubscribeFromNotifications: () => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextProps>({
  isConnected: false,
  client: null,
  sendMessage: () => {},
  notifications: [],
  newNotificationCount: 0,
  markNotificationsAsRead: () => {},
  subscribed: true,
  subscribeToNotifications: async () => {},
  unsubscribeFromNotifications: async () => {},
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [subscribed, setSubscribed] = useState(true);
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  // Hook to update the backend subscription state.
  const updateSubscription = useUpdateNotificationSubscription();

  useEffect(() => {
    if (!user) return;

    const socketURL = process.env.NEXT_PUBLIC_BASE_URL + '/ws';
    console.log('Initializing STOMP client at', socketURL);

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketURL),
      reconnectDelay: 5000,
      debug: (msg) => console.log('STOMP Debug:', msg),
      onConnect: () => {
        console.log('STOMP connection established');
        setIsConnected(true);

        // Subscribe if the user is subscribed.
        if (subscribed) {
          subscriptionRef.current = stompClient.subscribe('/user/topic/notifications', (message: IMessage) => {
            console.log('Received notification:', message.body);
            try {
              const notif: Notification = JSON.parse(message.body);
              setNotifications((prev) => [...prev, notif]);
              setNewNotificationCount((prev) => prev + 1);
            } catch (error) {
              console.error('Error parsing notification:', error);
            }
          });
        }
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
  }, [user, subscribed]);

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

  // Reset the new notification counter.
  const markNotificationsAsRead = () => {
    setNewNotificationCount(0);
  };

  // Function to subscribe to notifications.
  const subscribeToNotifications = async () => {
    if (clientRef.current && clientRef.current.connected && !subscriptionRef.current) {
      subscriptionRef.current = clientRef.current.subscribe('/user/topic/notifications', (message: IMessage) => {
        console.log('Received notification:', message.body);
        try {
          const notif: Notification = JSON.parse(message.body);
          setNotifications((prev) => [...prev, notif]);
          setNewNotificationCount((prev) => prev + 1);
        } catch (error) {
          console.error('Error parsing notification:', error);
        }
      });
      try {
        await updateSubscription.mutateAsync(true);
      } catch (error) {
        console.error('Failed to update subscription preference:', error);
      }
      setSubscribed(true);
    }
  };

  // Function to unsubscribe from notifications.
  const unsubscribeFromNotifications = async () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
      try {
        await updateSubscription.mutateAsync(false);
      } catch (error) {
        console.error('Failed to update subscription preference:', error);
      }
      setSubscribed(false);
    }
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
        subscribed,
        subscribeToNotifications,
        unsubscribeFromNotifications,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
