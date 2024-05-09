"use client";

import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { vectorSearch } from "@/lib/verctor-search";
import {
  createParser,
  type ParsedEvent,
  type ReconnectInterval,
} from "eventsource-parser";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useMessagesContext } from "./message-contenxt";
import { AutosizeTextarea } from "./autosize-textarea";

export const InputMessage = () => {
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { setMessages } = useMessagesContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // vector similarity search
    const similarityResults = await vectorSearch(inputMsg);

    const augmentedPrompt = {
      prompt: inputMsg,
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

          setMessages((prev) => {
            const newChat = [...prev];

            if (!firstFlag) {
              newChat[newChat.length - 1].LLM += text;
            } else {
              newChat.push({ question: inputMsg, LLM: text });
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

    // REVIEW:
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }

    setInputMsg("");
    setLoading(false);
  };

  return (
    <form
      className="flex w-full rounded-md pt-10 pb-20 min-h-10 gap-x-2"
      onSubmit={handleSubmit}
    >
      <div className="relative flex w-full">
        <AutosizeTextarea
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          className="pr-14 placeholder:text-lg text-lg"
          placeholder="ask LLM"
        />

        <div className="absolute right-2 bottom-2">
          {loading ? (
            <Button disabled variant={"ghost"} className="h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </Button>
          ) : (
            <Button variant={"ghost"} className="h-full">
              <Send className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
