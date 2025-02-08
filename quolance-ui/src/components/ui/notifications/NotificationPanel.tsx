'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';

import {
  Notification,
  useGetAllNotifications,
  useMarkNotificationAsRead,
} from '@/api/notifications-api';
import { useWebSocket } from '@/util/context/webSocketContext';

const NotificationPanel: React.FC = () => {
  // Dropdown open/close state.
  const [isOpen, setIsOpen] = useState(false);

  // React Query hook to fetch all notifications.
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllNotifications();
  const { mutate: markNotificationAsRead } = useMarkNotificationAsRead();

  // Get new notification count from the WebSocket context.
  const { newNotificationCount } = useWebSocket();

  // Refetch notifications every time a new notification arrives.
  useEffect(() => {
    refetch();
  }, [newNotificationCount, refetch]);

  // Toggle the dropdown open/closed.
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // When a notification is clicked, mark it as read.
  const handleMarkAsRead = (id: number) => {
    markNotificationAsRead(id);
  };

  // Calculate the count of unread notifications.
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <div className="relative">
      {/* Bell icon button toggles the dropdown */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-6 w-6" aria-hidden="true" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {unreadCount}
          </div>
        )}
      </button>
      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 p-4 z-50">
          <h3 className="mb-2 text-lg font-semibold">Notifications</h3>
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading notifications...</p>
          ) : isError ? (
            <p className="text-sm text-gray-500">Error loading notifications.</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-gray-500">
              No unread notifications available.
            </p>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {notifications.map((notif: Notification) => (
                <li
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read) {
                      handleMarkAsRead(notif.id);
                    }
                  }}
                  className={`p-2 border-b last:border-0 cursor-pointer flex justify-between items-center ${
                    notif.read
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <div>
                    <p>{notif.message}</p>
                    <small>{new Date(notif.timestamp).toLocaleString()}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={toggleDropdown}
            className="mt-2 block text-sm text-blue-600 hover:underline"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
