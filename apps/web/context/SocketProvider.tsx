"use client";

import React, { useCallback, useEffect, useContext, useState } from "react";
import socketIOClient, { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface IScoketContext {
  sendMessage: (msg: string) => any;
  messages: string[];
  socketId: string | null;
}

const SocketContext = React.createContext<IScoketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) {
    throw new Error("State is Undefined");
  }
  return state;
};

const ENDPOINT = "http://localhost:8000";

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);
  const [socketId, setSocketId] = useState("");

  const sendMessage: IScoketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("Send Message", msg);
      if (socket) {
        socket.emit("event:message", { id: socket.id, message: msg });
        // console.log({ id: socket.id, message: msg });
      }
    },
    [socket]
  );

  const onMessageRec = useCallback((msg: string) => {
    console.log("From Server Msg Rec", msg);
    const { message } = JSON.parse(msg) as { id: string; message: string };
    console.log(message);
    setMessages((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    const _socket = io(ENDPOINT);
    _socket.on("message", onMessageRec);
    setSocket(_socket);
    return () => {
      _socket.off("message", onMessageRec);
      _socket.close();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages, socketId }}>
      {children}
    </SocketContext.Provider>
  );
};
