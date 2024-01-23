"use client";

import React, { useCallback, useEffect, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface IScoketContext {
  sendMessage: (msg: string) => any;
  messages: { id: string; message: string }[]; // Update the type of messages
  id: string | null;
}

const SocketContext = React.createContext<IScoketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) {
    throw new Error("State is Undefined");
  }
  return state;
};

const ENDPOINT = "https://scalable-chatterup-production.up.railway.app";

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<{ id: string; message: string }[]>(
    []
  );
  const [id, setId] = useState<string | null>(null);

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
    const messageObject = JSON.parse(msg) as { id: string; message: string };
    console.log(messageObject.id, messageObject.message);
    setMessages((prev) => [...prev, messageObject]);
  }, []);

  useEffect(() => {
    const _socket = io(ENDPOINT);

    _socket.on("connect", () => {
      // Log the socket ID after the connection is established
      console.log("Socket ID:", _socket.id);
      if (_socket.id) {
        setId(_socket.id);
      } else {
        setId(null);
      }
    });

    _socket.on("message", onMessageRec);

    setSocket(_socket);

    return () => {
      _socket.off("message", onMessageRec);
      _socket.close();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages, id }}>
      {children}
    </SocketContext.Provider>
  );
};
