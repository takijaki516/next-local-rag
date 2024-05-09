"use client";

import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

interface IMessage {
  user: "User" | "LLM";
  content: string;
}

interface IMessageContext {
  messages: IMessage[];
  setMessages: Dispatch<SetStateAction<IMessage[]>>;
}

export const MessageContext = createContext<IMessageContext | null>(null);

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      user: "LLM",
      content:
        "Hello, I am a helpful nutrition assistant. How can I help you today?",
    },
  ]);

  return (
    <MessageContext.Provider
      value={{
        messages: messages,
        setMessages: setMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessagesContext = () => {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error("useMessagesContext must be used within a MessageProvider");
  }

  return context;
};
