export interface Message {
  id: number | null;
  senderUuid: string;
  receiverUuid: string;
  message: string;
  timestamp: string; // ISO string from backend (e.g., "2025-10-22T14:30:00")
  isRead: boolean;
}
