"use client";

import { useState } from "react";
import {
  createParser,
  type ParsedEvent,
  type ReconnectInterval,
} from "eventsource-parser";
import { Loader2, Send } from "lucide-react";

import { UserMessage } from "./user-message";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { LLMMessage } from "./llm-message";
import { vectorSearch } from "@/lib/llm";

interface Message {
  content: string;
  user: "User" | "LLM";
}

export interface RagPayload {
  prompt: string;
  // TODO: add docs metadata
  docs: Array<{ content: string }>;
}

const sampleMessages: Message[] = [];

export const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // similarity search
    const similarityResults = await vectorSearch(prompt);

    const augmentedPrompt = {
      prompt: prompt,
      docs: similarityResults.map((res) => {
        return { content: res.content };
      }),
    };

    const response = await fetch("/api/ollama/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(augmentedPrompt),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const body = response.body;
    if (!body) {
      return;
    }

    let firstFlag = true;

    const parseLLM = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? "";
          console.log(text);

          setMessages((prev) => {
            const newChat = [...prev];

            if (!firstFlag) {
              newChat[newChat.length - 1].content += text;
            } else {
              newChat.push({ user: "LLM", content: text });
              firstFlag = false;
            }
            return newChat;
          });
        } catch (e) {
          console.error(e);
        }
      }
    };

    const reader = body.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(parseLLM);
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-w-fit">
      {/* TODO: fix ui */}
      <div className="flex flex-col space-y-2 w-">
        {messages.map((message, index) => {
          if (message.user === "User") {
            return <UserMessage key={index} content={message.content} />;
          } else {
            return <LLMMessage key={index} content={message.content} />;
          }
        })}
      </div>

      <form
        className="flex flex-col w-full max-w-3xl items-center
        rounded-md mt-10"
        onSubmit={handleSubmit}
      >
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="rounded-md outline-none"
          placeholder="ask LLM"
        />

        <div className="w-full mt-2">
          {loading ? (
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button variant={"outline"} className="w-full">
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
