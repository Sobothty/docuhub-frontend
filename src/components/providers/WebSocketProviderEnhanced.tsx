"use client";

/**
 * Enhanced WebSocket Provider with Message Queue and Retry Logic
 *
 * Improvements over basic version:
 * - Message queue for offline scenarios
 * - Automatic retry on failure
 * - Message status tracking (sending, sent, failed)
 * - Better error handling
 */

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

// Enhanced message with status
interface EnhancedMessage extends Message {
  status?: "sending" | "sent" | "delivered" | "failed";
  tempId?: string;
  retryCount?: number;
}

interface WebSocketContextType {
  isConnected: boolean;
  sendPrivateMessage: (
    receiverUuid: string,
    message: string
  ) => Promise<boolean>;
  allChats: Record<string, EnhancedMessage[]>;
  currentUser: UserProfile | null;
  stompClient: Client | null;
  queuedMessages: number; // Number of messages in queue
  retryFailedMessage: (tempId: string) => void;
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

export function WebSocketProviderEnhanced({
  children,
}: WebSocketProviderProps) {
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [allChats, setAllChats] = useState<Record<string, EnhancedMessage[]>>(
    {}
  );
  const [messageQueue, setMessageQueue] = useState<EnhancedMessage[]>([]);

  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const { data: allUsers } = useGetAllUsersQuery();

  // Get current user
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

    console.log("🔌 Initializing Enhanced WebSocket connection...");

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
              const payload: EnhancedMessage = JSON.parse(msg.body);
              console.log("📩 Received message:", payload);

              // Update message status if it's a confirmation
              if (payload.status === "delivered") {
                updateMessageStatus(payload.id!, "delivered");
                return;
              }

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
                return {
                  ...prev,
                  [otherUserId]: [...conv, { ...payload, status: "delivered" }],
                };
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

    return () => {
      console.log("🧹 Cleaning up WebSocket connection");
      subscriptionRef.current?.unsubscribe();
      stompClient.deactivate();
      setIsConnected(false);
    };
  }, [currentUser?.uuid, session?.accessToken]);

  // Process message queue when connected
  useEffect(() => {
    if (isConnected && messageQueue.length > 0) {
      console.log(`📤 Processing ${messageQueue.length} queued messages`);

      messageQueue.forEach((msg) => {
        // Send queued message
        if (stompClientRef.current?.connected) {
          stompClientRef.current.publish({
            destination: "/app/private-message",
            body: JSON.stringify(msg),
          });

          // Update status to sent
          updateMessageStatus(msg.tempId!, "sent");
        }
      });

      // Clear queue
      setMessageQueue([]);
    }
  }, [isConnected, messageQueue]);

  // Update message status
  const updateMessageStatus = (
    identifier: string | number,
    status: EnhancedMessage["status"]
  ) => {
    setAllChats((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((userId) => {
        updated[userId] = updated[userId].map((msg) =>
          msg.id === identifier || msg.tempId === identifier
            ? { ...msg, status }
            : msg
        );
      });
      return updated;
    });
  };

  // Send private message with retry logic
  const sendPrivateMessage = async (
    receiverUuid: string,
    message: string
  ): Promise<boolean> => {
    if (!message.trim() || !currentUser) {
      console.warn("⚠️ Cannot send message: invalid data");
      return false;
    }

    const tempId = `temp-${Date.now()}-${Math.random()}`;

    const tempMessage: EnhancedMessage = {
      id: null,
      senderUuid: currentUser.uuid,
      message: message,
      receiverUuid: receiverUuid,
      timestamp: new Date().toISOString(),
      isRead: false,
      status: "sending",
      tempId: tempId,
      retryCount: 0,
    };

    // Add to local state immediately (optimistic update)
    setAllChats((prev) => {
      const conv = prev[receiverUuid] || [];
      return { ...prev, [receiverUuid]: [...conv, tempMessage] };
    });

    // Check connection
    if (!stompClientRef.current?.connected || !isConnected) {
      console.warn("⚠️ Not connected - queuing message");
      setMessageQueue((prev) => [...prev, tempMessage]);
      updateMessageStatus(tempId, "failed");
      return false;
    }

    try {
      console.log("📤 Sending private message:", tempMessage);

      stompClientRef.current.publish({
        destination: "/app/private-message",
        body: JSON.stringify(tempMessage),
      });

      // Update status to sent
      updateMessageStatus(tempId, "sent");
      return true;
    } catch (error) {
      console.error("❌ Failed to send message:", error);

      // Add to queue for retry
      setMessageQueue((prev) => [...prev, tempMessage]);
      updateMessageStatus(tempId, "failed");
      return false;
    }
  };

  // Retry a failed message
  const retryFailedMessage = (tempId: string) => {
    setAllChats((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((userId) => {
        const msg = updated[userId].find((m) => m.tempId === tempId);
        if (msg && msg.status === "failed") {
          sendPrivateMessage(msg.receiverUuid, msg.message);
        }
      });
      return updated;
    });
  };

  const value: WebSocketContextType = {
    isConnected,
    sendPrivateMessage,
    allChats,
    currentUser,
    stompClient: stompClientRef.current,
    queuedMessages: messageQueue.length,
    retryFailedMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
