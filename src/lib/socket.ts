import { io } from "socket.io-client";

// In development, the socket server is the same as the dev server
const SOCKET_URL = window.location.origin;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
