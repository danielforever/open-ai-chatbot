"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

const Login = () => {
  return (
    <div className="bg-slate-900 h-screen flex items-center justify-center">
      {/* Login form container */}
      <div className="flex w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
        {/* Line on the left */}
        <div className="border-r-2 border-gray-300 px-4 py-6">{/* Empty space for now */}</div>
        {/* Login content container */}
        <div className="px-8 py-10">
          {/* Heading */}
          <h1 className="text-6xl font-bold mb-7">
            Open <span className="text-8xl text-blue-900">AI</span> Chatbot
          </h1>

          {/* Sign in with Google button */}
          <button
            onClick={() => signIn("Microsoft")}
            className="flex items-center w-full justify-center tracking-widest gap-2 px-6 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:outline-none hover:bg-gray-100 active:bg-gray-200"
          >
            {/* Microsoft logo */}
            <Image
              src="/Microsoft.png"
              alt="Microsoft Logo"
              width={30}
              height={30}
              className="object-contain"
            />
            {/* Button text */}
            <span className="uppercase">Sign in with Microsoft</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
