"use client";

import { UserMessage } from "./user-message";
import { LLMMessage } from "./llm-message";
import { useMessagesContext } from "./message-contenxt";

export const ChatComponent = () => {
  const { messages } = useMessagesContext();

  return (
    <div className="flex flex-col min-w-fit">
      {/* TODO: fix ui */}
      <div className="flex flex-col space-y-2 divide-y">
        {messages.map((message, index) => {
          if (message.user === "User") {
            return <UserMessage key={index} content={message.content} />;
          } else {
            return <LLMMessage key={index} content={message.content} />;
          }
        })}
      </div>
    </div>
  );
};
