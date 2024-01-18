"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className={classes["chat-input"]}
          placeholder="Message..."
        />
        <button type="submit" className={classes["button"]}>
          Send
        </button>
      </form>
      <div>
        {messages.map((e, index) => (
          <li key={index}>{e}</li>
        ))}
      </div>
    </div>
  );
}
