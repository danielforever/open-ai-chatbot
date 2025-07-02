import { v4 as uuidv4 } from "uuid";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface NewProjectButtonProps {
  onCreate: (ids: { projectId: string; chatId: string }) => void;
}

const NewProjectButton: React.FC<NewProjectButtonProps> = ({ onCreate }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = async () => {
    if (!session?.user?.email) return;
    const projectId = uuidv4();
    // Create a new chat associated with this project
    const res = await fetch(`${API_BASE}/api/chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.email, projectId }),
    });
    const data = await res.json();
    onCreate({ projectId, chatId: data.chatId });
    router.push(`/project/${projectId}/chat/${data.chatId}`);
  };

  return (
    <div onClick={handleClick} className="border-gray-700 border chatRow">
      <PlusIcon className="h-4 w-4" />
      <p> New Project </p>
    </div>
  );
};

export default NewProjectButton;