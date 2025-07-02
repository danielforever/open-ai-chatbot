"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { db } from "@/firebaseStore";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;


const NewChat = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const createNewChat = async () => {
    if (!session?.user?.email) return;
    const res = await fetch(`${API_BASE}/api/chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.email }),
    });
    const data = await res.json();
    router.push(`/chat/${data.chatId}`);
  };

  return (
    <div onClick={createNewChat} className="border-gray-700 border chatRow">
      <PlusIcon className="h-4 w-4" />
      <p> New Chat</p>
    </div>
  );
};

export default NewChat;
