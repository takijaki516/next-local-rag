import { ChatComponent } from "@/components/chat-component";
import { LLMMessage } from "@/components/llm-message";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1
        className="text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent
      pb-20 from-cyan-700 to-fuchsia-700"
      >
        LOCAL RAG APP
      </h1>

      <LLMMessage content="Hello, I'm helpful nutrition assistant" />

      <ChatComponent />
    </main>
  );
}
