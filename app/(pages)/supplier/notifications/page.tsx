"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck } from "lucide-react"; // lucide-react se import karein

// --- DUMMY DATA ---
const initialNotifications = [
  {
    _id: "1",
    message:
      "New order #ORD-456 has been placed for your product 'Gold Pearl Pendant Necklace'.",
    link: "/supplier/orders",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    _id: "2",
    message:
      "Your product 'Classic Gold Bangle' is running low on stock. Only 5 items left.",
    link: "/supplier/inventory",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    _id: "3",
    message: "Your profile information was successfully updated.",
    link: "/supplier/profile",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    _id: "4",
    message:
      "Order #ORD-001 has been marked as 'Completed'. Payment has been processed.",
    link: "/supplier/orders",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];
// --- END OF DUMMY DATA ---

type Notification = (typeof initialNotifications)[0];

const NotificationItem: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  return (
    <div
      className={`p-4 border-l-4 flex items-start space-x-4 transition-colors ${
        notification.isRead
          ? "border-gray-200 bg-gray-50 hover:bg-gray-100"
          : "border-orange-500 bg-white hover:bg-orange-50"
      }`}
    >
      <div className="flex-shrink-0 pt-1">
        <Bell
          className={`h-5 w-5 ${
            notification.isRead ? "text-gray-400" : "text-orange-500"
          }`}
        />
      </div>
      <div className="flex-1">
        <p
          className={`text-sm ${notification.isRead ? "text-gray-600" : "text-gray-900 font-medium"}`}
        >
          {notification.message}
        </p>
        <span className="text-xs text-gray-500 mt-1 block">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </span>
        {notification.link && (
          <Link
            href={notification.link}
            className="text-xs text-orange-600 hover:underline mt-1 inline-block"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      alert("All notifications marked as read!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-500 mt-1">
            All your recent updates and alerts will appear here.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            <CheckCheck className="mr-2 h-5 w-5" />
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
        {notifications.length === 0 ? (
          <div className="p-16 text-center">
            <Bell className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">You have no notifications.</p>
            <p className="text-sm text-gray-400 mt-1">
              Check back later for new updates.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
