import { v4 as uuidv4 } from "uuid";
import { PlusIcon } from "@heroicons/react/24/solid";

interface NewProjectButtonProps {
  onCreate: (ids: { projectId: string; chatId: string }) => void;
}

const NewProjectButton: React.FC<NewProjectButtonProps> = ({ onCreate }) => {
  const handleClick = async () => {
    const projectId = uuidv4();
    const chatId = uuidv4();
    // Optionally, call your backend to create a project record here
    onCreate({ projectId, chatId });
  };

  return (
    <div onClick={handleClick} className="border-gray-700 border chatRow">
        <PlusIcon className="h-4 w-4" />
        <p> New Project </p>
    </div>
  );
};

export default NewProjectButton;