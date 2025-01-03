import React from 'react';
import { useNotification } from '../contexts/NotificationContext';

function Notification() {
  const { notification } = useNotification();

  if (!notification) {
    return null;
  }

  const { message, type } = notification;

  let bgColor = 'bg-green-500';
  if (type === 'error') {
    bgColor = 'bg-red-500';
  } else if (type === 'warning') {
    bgColor = 'bg-yellow-500';
  }
  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-md text-white ${bgColor} transition-opacity duration-300`}
    >
      {message}
    </div>
  );
}

export default Notification;
