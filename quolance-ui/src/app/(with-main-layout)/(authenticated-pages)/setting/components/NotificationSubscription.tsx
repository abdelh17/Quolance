'use client';
import React from 'react';

import { useGetNotificationSubscription, useUpdateNotificationSubscription } from '@/api/notifications-api';
import { useWebSocket } from '@/util/context/webSocketContext';

export default function NotificationSubscription() {
  // Fetch the persisted subscription status from the backend
  const { data: subscriptionStatus, refetch: refetchSubscription } = useGetNotificationSubscription();
  // Hook for updating the backend subscription status
  const { mutate: updateSubscription } = useUpdateNotificationSubscription();
  // Retrieve the WebSocket context values
  const { subscribed, subscribeToNotifications, unsubscribeFromNotifications } = useWebSocket();

  // Determine the current subscription status (backend first, then fallback to local state)
  const currentSubscribed = subscriptionStatus !== undefined ? subscriptionStatus : subscribed;

  // Handle the toggle switch action
  const handleToggle = () => {
    updateSubscription(!currentSubscribed, {
      onSuccess: () => {
        refetchSubscription(); // Refresh backend state after the update
        if (currentSubscribed) {
          unsubscribeFromNotifications();
        } else {
          subscribeToNotifications();
        }
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 data-test="notification-preferences" className="text-base/7 font-semibold">Notification Preferences</h2>
        <p data-test="notification-desc" className="mt-1 text-sm/6 text-gray-400">
          Manage your notifications. Toggle the switch on the right to{' '}
          {currentSubscribed ? 'unsubscribe from' : 'subscribe to'} notifications.
        </p>
      </div>

      <div className="flex items-center md:col-span-2">
        <label htmlFor="toggle-subscription" className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              data-test="notification-input"
              type="checkbox"
              id="toggle-subscription"
              className="sr-only"
              checked={currentSubscribed}
              onChange={handleToggle}
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
          <div className="ml-3 text-sm font-medium text-gray-700">
            {currentSubscribed ? 'Subscribed' : 'Unsubscribed'}
          </div>
        </label>
      </div>
    </div>
  );
}
