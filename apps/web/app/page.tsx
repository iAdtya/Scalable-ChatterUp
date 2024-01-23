"use client";

import { useState, useRef, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import Image from "next/image";
import logo from "./chats.png";

export default function Page() {
  const { sendMessage, messages, id } = useSocket();
  const [message, setMessage] = useState("");

  console.log("ID state changed", id);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[85vh] sm:h-[90vh] pb-4 ">
      <div className="justify-center flex py-6 px-6">
        <h1 className="text-3xl flex font-bold ">
          <Image src={logo} alt="logo" className="h-10 w-10 mr-2" />
          Scalable-ChatterUp
        </h1>
      </div>

      <div className="flex justify-center px-6 flex-grow ">
        <div
          id="chatbox"
          className=" bg-slate-900 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] w-full rounded-2xl flex flex-col justify-end overflow-y-auto"
        >
          {messages.map((e, index) => (
            <div
              key={index}
              className={`chat ${id === e.id ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-bubble">{e.message}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-6 px-6 fixed bottom-0 w-full ">
        <form onSubmit={handleSubmit} className="justify-center flex  ">
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            className="input input-bordered input-info w-full  "
            placeholder="Message..."
            required
          />

          <button
            type="submit"
            className="btn btn-primary ml-4 lg:w-64 md:w-48"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
