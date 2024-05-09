"use client";

import { UserMessage } from "./user-message";
import { LLMMessage } from "./llm-message";
import { useMessagesContext } from "./message-contenxt";

export const ChatComponent = () => {
  const { messages } = useMessagesContext();

  if (messages.length === 0) {
    return <LLMMessage content="Hello! I'm a helpful nutrition expert" />;
  }

  return (
    <div className="flex flex-col min-w-fit">
      <div className="flex flex-col space-y-2 divide-y-2">
        {messages.map((message, index) => {
          return (
            <div key={index}>
              <UserMessage content={message.question} />
              <LLMMessage content={message.LLM} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
