import { Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const LLMMessage = ({ content }: { content: string }) => {
  return (
    <div className="flex py-7 sm:px-6 gap-x-4">
      <Avatar>
        <AvatarFallback>
          <Bot className="w-6 h-6" />
        </AvatarFallback>
      </Avatar>
      <div className="w-full items-start">
        <p className="max-w-3xl">{content}</p>
      </div>
    </div>
  );
};
