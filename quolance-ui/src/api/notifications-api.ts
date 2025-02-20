import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import httpClient from '@/lib/httpClient';

export interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
}

/**
 * Hook to fetch all notifications for the authenticated user.
 * (Endpoint: /api/notifications/all)
 */
export const useGetAllNotifications = () => {
  return useQuery<Notification[], AxiosError>({
    queryKey: ['notifications', 'all'],
    queryFn: async () => {
      const { data } = await httpClient.get('/api/notifications/all');
      return data;
    },
  });
};

/**
 * Hook to fetch all unread notifications for the authenticated user.
 * (Endpoint: /api/notifications/all-unread)
 */
export const useGetUnreadNotifications = () => {
  return useQuery<Notification[], AxiosError>({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const { data } = await httpClient.get('/api/notifications/all-unread');
      return data;
    },
  });
};

/**
 * Hook to mark a notification as read.
 * Instead of invalidating (and refetching) the data—which may reorder notifications—we update the cache directly.
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, number>({
    mutationFn: async (id: number) => {
      await httpClient.patch(`/api/notifications/${id}/read`);
    },
    onSuccess: (_data, id) => {
      // Update the "all" notifications query cache.
      queryClient.setQueryData<Notification[]>(['notifications', 'all'], (oldData) => {
        if (!oldData) return [];
        return oldData.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        );
      });
      // Update the "unread" notifications query cache.
      queryClient.setQueryData<Notification[]>(['notifications', 'unread'], (oldData) => {
        if (!oldData) return [];
        return oldData.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        );
      });
      // Optionally update a global notifications query if used.
      queryClient.setQueryData<Notification[]>(['notifications'], (oldData) => {
        if (!oldData) return [];
        return oldData.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        );
      });
    },
  });
};

/**
 * Hook to update the notification subscription preference for the authenticated user.
 * Sends a PATCH request with the "subscribed" boolean.
 */
export const useUpdateNotificationSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, boolean>({
    mutationFn: async (subscribed: boolean) => {
      await httpClient.patch('/api/users/notifications', { subscribed });
    },
    onSuccess: () => {
      // Optionally invalidate notifications queries if needed.
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * Hook to get the current notification subscription status for the authenticated user.
 * (Endpoint: /api/users/notifications/status)
 */
export const useGetNotificationSubscription = () => {
  return useQuery<boolean, AxiosError>({
    queryKey: ['notifications', 'subscriptionStatus'],
    queryFn: async () => {
      const { data } = await httpClient.get('/api/users/notifications/status');
      return data.subscribed;
    },
  });
};
