'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  useGetAllNotifications,
  useMarkNotificationAsRead,
  Notification,
  useGetNotificationSubscription,
  useUpdateNotificationSubscription,
} from '@/api/notifications-api';
import { showToast } from '@/util/context/ToastProvider';
import { useWebSocket } from '@/util/context/webSocketContext';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const { data: notifications = [], isLoading, isError, refetch } = useGetAllNotifications();
  const { mutate: markNotificationAsRead } = useMarkNotificationAsRead();
  const { data: subscriptionStatus, refetch: refetchSubscription } = useGetNotificationSubscription();
  const { mutate: updateSubscription } = useUpdateNotificationSubscription();
  const { subscribed, subscribeToNotifications, unsubscribeFromNotifications } = useWebSocket();

  // Use the backend subscription status if available; otherwise, fall back to the context value.
  const currentSubscribed = subscriptionStatus !== undefined ? subscriptionStatus : subscribed;

  const filteredNotifications = notifications.filter((notif: Notification) => {
    if (filter === 'all') return true;
    if (filter === 'read') return notif.read;
    if (filter === 'unread') return !notif.read;
    return true;
  });

  const handleMarkAsRead = (id: number) => {
    markNotificationAsRead(id, {
      onSuccess: () => {
        showToast('Notification marked as read', 'success', { autoClose: 2000 }, 'bottom-right');
        refetch();
      },
    });
  };

  const handleToggleSubscription = () => {
    updateSubscription(!currentSubscribed, {
      onSuccess: () => {
        refetchSubscription(); // Refresh state from backend after update
        if (currentSubscribed) {
          unsubscribeFromNotifications();
        } else {
          subscribeToNotifications();
        }
      },
    });
  };

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Mobile Header */}
        <div className="sm:hidden">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your notifications and subscription preferences.
            </p>
          </div>
          {/* Mobile Filter Tabs */}
          <div className="mb-4 flex justify-center space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'read' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Read
            </button>
          </div>
          {/* Mobile Subscription Toggle */}
          <div className="mb-6 flex justify-center">
            <label htmlFor="toggle-subscription-mobile" className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="toggle-subscription-mobile"
                  className="sr-only"
                  checked={currentSubscribed}
                  onChange={handleToggleSubscription}
                />
                <div
                  className={`block w-14 h-8 rounded-full transition-colors duration-200 ${
                    currentSubscribed ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ${
                    currentSubscribed ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {currentSubscribed ? 'Subscribed' : 'Unsubscribed'}
              </span>
            </label>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block mb-8">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-gray-800">Notifications</h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your notifications and subscription preferences.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'read' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Read
              </button>
            </div>
            {/* Desktop Subscription Toggle */}
            <label htmlFor="toggle-subscription-desktop" className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="toggle-subscription-desktop"
                  className="sr-only"
                  checked={currentSubscribed}
                  onChange={handleToggleSubscription}
                />
                <div
                  className={`block w-14 h-8 rounded-full transition-colors duration-200 ${
                    currentSubscribed ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ${
                    currentSubscribed ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {currentSubscribed ? 'Subscribed' : 'Unsubscribed'}
              </span>
            </label>
          </div>
        </div>

        {/* Navigation Link */}
        <div className="mb-6 flex justify-center sm:justify-end">
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </div>

        {/* Notifications List */}
        {isLoading && <p className="text-gray-600 text-center">Loading notifications...</p>}
        {isError && <p className="text-red-500 text-center">Error loading notifications.</p>}
        {!isLoading && filteredNotifications.length === 0 && (
          <p className="text-gray-600 text-center">No notifications to display.</p>
        )}
        <div className="grid grid-cols-1 gap-6">
          {filteredNotifications.map((notif: Notification) => (
            <div
              key={notif.id}
              className={`rounded-lg p-6 shadow transition-colors duration-200 border ${
                notif.read ? 'border-gray-200 text-gray-500' : 'border-blue-600 text-gray-800'
              }`}
            >
              <p className="text-lg font-medium">{notif.message}</p>
              <div className="mt-4 flex items-center justify-between">
                <small className="text-xs">
                  {new Date(notif.timestamp).toLocaleString()}
                </small>
                {!notif.read && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
