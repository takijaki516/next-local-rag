import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { MessageProvider } from "@/components/message-contenxt";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "local rag",
  description:
    "local rag app using next(with app router), prisma(with pgvector), llama3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <MessageProvider>
        <body className={cn(inter.className, "min-h-screen")}>{children}</body>
      </MessageProvider>
    </html>
  );
}
