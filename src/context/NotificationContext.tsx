"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from "react";

interface Notification {
  id: number;
  message: string;
  time: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string) => void;
  onHistoryUpdate: () => void;
  addHistoryListener: (callback: () => void) => void;
  removeHistoryListener: (callback: () => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const listenersRef = useRef<(() => void)[]>([]); // ✅ useRef instead of useState

  const addNotification = (message: string) => {
    const newNotif = {
      id: Date.now(),
      message,
      time: new Date().toLocaleTimeString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // ✅ Trigger all registered listeners
  const onHistoryUpdate = () => {
    listenersRef.current.forEach((cb) => cb());
  };

  // ✅ Add a listener safely
  const addHistoryListener = (callback: () => void) => {
    if (!listenersRef.current.includes(callback)) {
      listenersRef.current.push(callback);
    }
  };

  // ✅ Remove a listener safely
  const removeHistoryListener = (callback: () => void) => {
    listenersRef.current = listenersRef.current.filter((cb) => cb !== callback);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        onHistoryUpdate,
        addHistoryListener,
        removeHistoryListener,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification must be used within NotificationProvider");
  return context;
};
