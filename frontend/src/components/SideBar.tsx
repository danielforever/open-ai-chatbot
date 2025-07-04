"use client";

import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
// import { collection, orderBy, query } from "firebase/firestore";
// import { db } from "@/firebaseStore";
import { Session } from "next-auth";
import { useSession, signOut } from "next-auth/react";
import useSWR from "swr";
// import { useCollection } from "react-firebase-hooks/firestore";
import ChatRow from "./ChatRow";
import ModelSelection from "./ModelSelection";
import NewChat from "./NewChat";
import NewProjectButton from "./NewProjectButton";
import { useRouter } from "next/navigation"; // For Next.js 13+ app router

export default function SideBar() {
  // Get the user session using next-auth
  const { data: session } = useSession();

  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const fetcher = (url: string) => fetch(`${API_BASE}${url}`).then(res => res.json());

  const { data: chats, isLoading, error } = useSWR(
    session ? `/api/chats?userId=${session.user.email}` : null,
    fetcher
  );

  // Handle errors loading chats
  if (error) {
    return <p>Error loading chats</p>;
  }

  return (
    <div className="p-2 flex flex-col h-screen">
      {/* Chat header */}
      <div className="flex-1 ">
        <div className="">
          <h2 className="text-white animate-pulse text-center p-2 my-3 text-sm  font-semibold bg-cyan-900 rounded-lg px-5 py-3flex items-center justify-center space-x-2">
            Only Text format are supported.
          </h2>

          {/* New Project Button */}
          
          <NewProjectButton
            onCreate={({ projectId, chatId }) => {
              // Navigate to the new project/chat page
              router.push(`/project/${projectId}/chat/${chatId}`);
            }}
          />

          {/* New Chat */}
          <NewChat />

          {/* ModelSelection */}
          <div className="hidden sm:inline">
            <ModelSelection />
          </div>

          {/* Map through the ChatRows */}
          <div className="flex flex-col space-y-2 my-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
            {isLoading && (
              <div className="animate-pulse text-center text-white">
                <p>Loading Chats...</p>
              </div>
            )}
            {(!chats || chats.length === 0) && !isLoading && (
              <div className="text-white text-center">No Chats Available</div>
            )}
            {chats?.map((chat: any) => (
              <ChatRow key={chat.id} id={chat.id} />
            ))}
          </div>
        </div>
      </div>

      {/* User profile and sign out button */}
      {session && (
        <div className="flex items-center space-y-4 justify-around">
          {/* User profile */}
          <div className="hidden md:flex md:flex-col md:justify-center md:items-center md:bg-slate-800 md:py-4 md:flex-1 md:mr-12 md:rounded-lg">
            <img
              src={session.user?.image!}
              alt={session.user?.name!}
              className="w-16 h-16 rounded-full mr-2"
            />
            <h3 className="text-xs text-center uppercase text-white font-bold pt-2">
              {session.user?.name!}
            </h3>
          </div>

          {/* Sign out button */}
          <button
            onClick={() => {
              signOut();
            }}
            className="border-gray-700 border chatRow gap-2 md:mr-2"
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
