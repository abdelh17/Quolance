'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import {
  Notification,
  useGetUnreadNotifications,
  useMarkNotificationAsRead,
} from '@/api/notifications-api';
import { useWebSocket } from '@/util/context/webSocketContext';

const NotificationPanel: React.FC = () => {
  // Dropdown open/close state.
  const [isOpen, setIsOpen] = useState(false);
  // Local counter for notifications marked as read while dropdown is open.
  const [readCount, setReadCount] = useState(0);

  // Use the hook to fetch unread notifications.
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useGetUnreadNotifications();
  const { mutate: markNotificationAsRead } = useMarkNotificationAsRead();

  // Get new notification count from the WebSocket context.
  const { newNotificationCount } = useWebSocket();

  // Refetch unread notifications whenever a new notification arrives,
  // and reset the local read counter.
  useEffect(() => {
    refetch();
    setReadCount(0);
  }, [newNotificationCount, refetch]);

  // Toggle the dropdown open/closed.
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // When a notification is clicked, mark it as read and update local count.
  const handleMarkAsRead = (id: number) => {
    markNotificationAsRead(id);
    setReadCount((prev) => prev + 1);
  };

  // The unread notifications count is the API unread count minus the locally marked count.
  const unreadCount = Math.max(notifications.length - readCount, 0);

  return (
    <div className="relative">
      {/* Bell icon with a subtle scale animation on hover */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition transform duration-200"
      >
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-6 w-6" aria-hidden="true" />
        {unreadCount > 0 && (
          <div
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center 
                       rounded-full bg-red-600 text-xs font-bold text-white transition-transform 
                       duration-200"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
            <span className="relative">{unreadCount}</span>
          </div>
        )}
      </button>
      {/* Dropdown panel with smooth fade/scale transition */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white 
                     shadow-lg ring-1 ring-black/5 p-4 z-50 transition-all duration-300 ease-out 
                     transform opacity-100 scale-100"
        >
          <h3 className="mb-2 border-b pb-1 text-lg font-semibold">Notifications</h3>
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading notifications...</p>
          ) : isError ? (
            <p className="text-sm text-gray-500">Error loading notifications.</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-gray-500">
              No unread notifications available.
            </p>
          ) : (
            <ul className="max-h-64 overflow-y-auto space-y-1">
              {notifications.map((notif: Notification) => (
                <li
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read) {
                      handleMarkAsRead(notif.id);
                    }
                  }}
                  className={`p-2 border-b last:border-0 cursor-pointer flex justify-between items-center transition-colors duration-200 ease-in-out hover:bg-gray-50 ${
                    notif.read
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <div>
                    <p className="font-medium">{notif.message}</p>
                    <small className="text-xs">
                      {new Date(notif.timestamp).toLocaleString()}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={toggleDropdown}
            className="mt-2 block text-sm text-blue-600 hover:underline transition-colors duration-200"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
