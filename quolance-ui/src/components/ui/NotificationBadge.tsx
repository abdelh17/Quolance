'use client';
import React from 'react';

interface NotificationBadgeProps {
  showBadge: boolean;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ showBadge }) => {
  if (!showBadge) return null;
  return (
    <div className="absolute -top-1 -right-1">
      <div className="h-3 w-3 rounded-full bg-red-600 border-2 border-white" />
    </div>
  );
};

export default NotificationBadge;
