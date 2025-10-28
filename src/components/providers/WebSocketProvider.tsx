"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import SockJS from "sockjs-client";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { Message } from "@/types/message";
import { useGetAllUsersQuery } from "@/feature/users/usersSlice";
import { UserProfile } from "@/types/userType";

interface WebSocketContextType {
  isConnected: boolean;
  sendPrivateMessage: (receiverUuid: string, message: string) => void;
  allChats: Record<string, Message[]>;
  currentUser: UserProfile | null;
  stompClient: Client | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [allChats, setAllChats] = useState<Record<string, Message[]>>({});

  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const { data: allUsers } = useGetAllUsersQuery();

  // Get current user from all users based on session email
  useEffect(() => {
    if (!allUsers || !session?.user?.email) return;
    const user = allUsers.find((u) => u.email === session.user.email);
    if (user) {
      setCurrentUser(user as UserProfile);
    }
  }, [allUsers, session]);

  // WebSocket connection setup
  useEffect(() => {
    if (!currentUser?.uuid || !session?.accessToken) {
      setIsConnected(false);
      return;
    }

    console.log("🔌 Initializing WebSocket connection...");

    const socket = new SockJS(
      process.env.NEXT_PUBLIC_WS_URL || "https://api.docuhub.me/ws-chat"
    );

    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log("🔵 WebSocket:", str);
      },
      onConnect: () => {
        console.log("✅ WebSocket connected successfully");
        setIsConnected(true);

        // Subscribe to user's personal topic
        const myTopic = `/topic/user.${currentUser.uuid}`;
        console.log(`📡 Subscribing to topic: ${myTopic}`);

        subscriptionRef.current = stompClient.subscribe(
          myTopic,
          (msg: IMessage) => {
            try {
              const payload: Message = JSON.parse(msg.body);
              console.log("📩 Received message:", payload);

              const otherUserId =
                payload.senderUuid === currentUser.uuid
                  ? payload.receiverUuid
                  : payload.senderUuid;

              setAllChats((prev) => {
                const conv = prev[otherUserId] || [];
                // Prevent duplicate messages
                if (payload.id && conv.some((m) => m.id === payload.id)) {
                  return prev;
                }
                return { ...prev, [otherUserId]: [...conv, payload] };
              });
            } catch (error) {
              console.error("❌ Error parsing message:", error);
            }
          }
        );
      },
      onStompError: (frame) => {
        console.error("❌ WebSocket STOMP error:", frame);
        setIsConnected(false);
      },
      onWebSocketError: (error) => {
        console.error("❌ WebSocket error:", error);
        setIsConnected(false);
      },
      onDisconnect: () => {
        console.log("🔴 WebSocket disconnected");
        setIsConnected(false);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    // Cleanup on unmount or when dependencies change
    return () => {
      console.log("🧹 Cleaning up WebSocket connection");
      subscriptionRef.current?.unsubscribe();
      stompClient.deactivate();
      setIsConnected(false);
    };
  }, [currentUser?.uuid, session?.accessToken]);

  const sendPrivateMessage = (receiverUuid: string, message: string) => {
    if (!stompClientRef.current?.connected || !message.trim() || !currentUser) {
      console.warn("⚠️ Cannot send message: not connected or invalid data");
      return;
    }

    const tempMessage: Message = {
      id: null,
      senderUuid: currentUser.uuid,
      message: message,
      receiverUuid: receiverUuid,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    console.log("📤 Sending private message:", tempMessage);

    stompClientRef.current.publish({
      destination: "/app/private-message",
      body: JSON.stringify(tempMessage),
    });

    // Optimistically add message to local state
    setAllChats((prev) => {
      const conv = prev[receiverUuid] || [];
      return { ...prev, [receiverUuid]: [...conv, tempMessage] };
    });
  };

  const value: WebSocketContextType = {
    isConnected,
    sendPrivateMessage,
    allChats,
    currentUser,
    stompClient: stompClientRef.current,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
