"use client";

import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
// import { collection, orderBy, query } from "firebase/firestore";
// import { db } from "@/firebaseStore";
import { useSession } from "next-auth/react";
// import { useCollection } from "react-firebase-hooks/firestore";
import useSWR from "swr";
import { useEffect, useRef } from "react";
import Message from "./Message";

type Props = {
  chatId: string;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Chat: React.FC<Props> = ({ chatId }) => {
  const { data: session } = useSession();

  // Fetch messages from backend API
  const { data: messages, error } = useSWR(
    session ? `/api/chat/${chatId}/messages?userId=${session.user?.email}` : null,
    fetcher
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (error) {
    return <p className="text-center text-red-500">Failed to load messages.</p>;
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {!messages?.length && (
        <>
          <p className="mt-10 text-center text-white">Type a prompt in below to get started!</p>
          <ArrowDownCircleIcon className="h-10 w-10 mx-auto mt-5 text-white animate-bounce" />
        </>
      )}

      {messages?.map((message: any) => (
        <Message key={message.id} message={message} />
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chat;