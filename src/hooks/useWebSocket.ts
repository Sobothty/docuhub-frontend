/**
 * WebSocket Hook
 *
 * A custom hook to access the global WebSocket connection.
 * This hook provides access to:
 * - Connection status
 * - Send private messages
 * - All chat messages
 * - Current user information
 * - STOMP client instance
 *
 * @example
 * ```tsx
 * import { useWebSocket } from '@/hooks/useWebSocket';
 *
 * function MyComponent() {
 *   const { isConnected, sendPrivateMessage, allChats } = useWebSocket();
 *
 *   const handleSend = () => {
 *     sendPrivateMessage('receiver-uuid', 'Hello World!');
 *   };
 *
 *   return (
 *     <div>
 *       <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
 *       <button onClick={handleSend}>Send Message</button>
 *     </div>
 *   );
 * }
 * ```
 */
export { useWebSocket } from "@/components/providers/WebSocketProvider";
