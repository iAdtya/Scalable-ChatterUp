"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import Image from "next/image";
import logo from "./chats.png";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

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

      {/* <div>
        {messages.map((e, index) => (
          <li key={index}>{e}</li>
        ))}
      </div> */}
      <div className="flex justify-center px-6 flex-grow ">
        <div
          id="chatbox"
          className=" bg-slate-900 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] w-full rounded-2xl "
        >
          <div className="chat chat-start ">
            <div className="chat-header">
              Obi-Wan Kenobi
              <time className="text-xs opacity-50 ml-2">12:45</time>
            </div>
            <div className="chat-bubble">You were the Chosen One!</div>
          </div>
          <div className="chat chat-end">
            <div className="chat-header">
              Anakin
              <time className="text-xs opacity-50 ml-2">12:46</time>
            </div>
            <div className="chat-bubble">I hate you!</div>
          </div>
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
            className="btn btn-primary ml-4 lg:w-52 md:w-44"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
