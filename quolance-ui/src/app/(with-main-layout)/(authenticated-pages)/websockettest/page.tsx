/* eslint-disable no-console */
'use client';

import { Client, IMessage } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';

const WebSocketPage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [destination, setDestination] = useState('/app/greet'); // Default destination
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    const socketURL = 'http://localhost:8080/ws'; // Update this URL based on your server
    console.log('Initializing STOMP client...');

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketURL), // Native WebSocket
      reconnectDelay: 5000,
      debug: (str) => console.log(str), // Debugging messages
      onConnect: () => {
        console.log('STOMP connection established');
        setIsConnected(true);

        // Subscribe to topics
        stompClient.subscribe('/topic/greetings', (message: IMessage) => {
          console.log('Received greeting:', message.body);
          setReceivedMessages((prev) => [...prev, `Greeting: ${message.body}`]);
        });

        stompClient.subscribe(`/user/topic/notifications`, (message: IMessage) => {
          console.log('Received notification:', message.body);
          setReceivedMessages((prev) => [...prev, `Notification: ${message.body}`]);
        });

        stompClient.subscribe('/topic/chat', (message: IMessage) => {
          console.log('Received chat:', message.body);
          setReceivedMessages((prev) => [...prev, `Chat: ${message.body}`]);
        });
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
    stompClientRef.current = stompClient;

    return () => {
      console.log('Deactivating STOMP client...');
      stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    const stompClient = stompClientRef.current;

    if (!stompClient || !stompClient.connected) {
      console.error('STOMP client is not connected.');
      return;
    }

    const payload = {
      message,
      sender: 'NextJsClient',
      timestamp: new Date().toISOString(),
    };

    console.log('Sending message:', payload);
    stompClient.publish({
      destination,
      body: JSON.stringify(payload),
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>WebSocket STOMP Test</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Destination:
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{ marginLeft: '10px' }}
          >
            <option value="/app/greet">/app/greet</option>
            <option value="/app/notify">/app/notify</option>
            <option value="/app/chat">/app/chat</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '300px', marginRight: '10px' }}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>

      <h2>Received Messages</h2>
      <div
        style={{
          marginTop: '20px',
          border: '1px solid #ccc',
          padding: '10px',
          maxHeight: '200px',
          overflowY: 'scroll',
        }}
      >
        {receivedMessages.length > 0 ? (
          receivedMessages.map((msg, index) => (
            <p key={index} style={{ margin: 0 }}>
              {msg}
            </p>
          ))
        ) : (
          <p>No messages received yet.</p>
        )}
      </div>
    </div>
  );
};

export default WebSocketPage;