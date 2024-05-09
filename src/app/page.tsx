import { ChatComponent } from "@/components/chat-component";
import { InputMessage } from "@/components/input-message";

export default function Home() {
  return (
    <main className="container max-w-2xl flex min-h-screen flex-col items-center">
      <h1
        className="pt-24 text-5xl font-bold bg-gradient-to-r bg-clip-text
        text-transparent from-cyan-700 to-fuchsia-700"
      >
        LOCAL RAG APP
      </h1>

      <div className="pt-10 w-full">
        <ChatComponent />
      </div>

      <InputMessage />
    </main>
  );
}
