"use client";

import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "@/firebaseStore";
import ModelSelection from "./ModelSelection";
import { Messages } from "typings";

interface Props {
  chatId: string;
}

// const jwt = require("jsonwebtoken");

// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ error: "No token provided" });

//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.NEXTAUTH_SECRET, (err, decoded) => {
//     if (err) return res.status(403).json({ error: "Invalid token" });
//     req.user = decoded;
//     next();
//   });
// }


const ChatInput: React.FC<Props> = ({ chatId }) => {
  const [prompt, setPrompt] = useState("");
  const { data: session } = useSession();
  const { data: model } = useSWR<string>("model", {
    fallbackData: "gpt-3.5-turbo-0125",
  });

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt || !session) {
      return;
    }

    const input = prompt.trim();
    setPrompt("");

    const messages: Messages = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: session.user?.email!,
        name: session.user?.name!,
        avatar: session.user?.image ??
  `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "User")}&background=random&format=png`
      },
    };

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, chatId, projectId, session: session.user }),
      });

      const notification = toast.loading("OpenAI is thinking...");

      // const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
      const API_BASE = 'http://localhost:5000';

      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, chatId, model, session: session.user }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add AI response to Firestore
        await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, chatId, projectId, session: session.user }),
        });
        toast.success("OpenAI has responded!", { id: notification });
      } else {
        toast.error("Failed to get a response from OpenAI.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred while sending the message.");
    }
  };

  return (
    <div className="bg-gray-700/50 text-gray-400 rounded-lg text-sm">
      <form onSubmit={sendMessage} className="p-5 space-x-5 flex">
        <input
          className="bg-transparent flex-1 focus:outline-none disabled:cursor-not-allowed disabled:tex-gray-300"
          disabled={!session}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          placeholder="Type your message here..."
        />
        <button
          disabled={!prompt || !session}
          type="submit"
          className="bg-[#11A37F] hover:opacity-50 text-white font-bold px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="w-4 h-4 -rotate-45 " />
        </button>
      </form>

      <div className="md:hidden ">
        {/* ModelSelection */}
        <ModelSelection />
      </div>
    </div>
  );
};

export default ChatInput;
