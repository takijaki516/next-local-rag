import path from "node:path";
import fs from "node:fs";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Ollama } from "ollama";

import { prismaDB } from "../src/lib/prismaDB";

const ollama = new Ollama({ host: "http://localhost:11434" });

const main = async () => {
  // TODO:  need better approach to load and parse
  const loader = new PDFLoader(
    path.join(__dirname, "..", "content", "nutrition.pdf")
  );
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter();
  let langchainDocs = await splitter.splitDocuments(docs);

  for (const doc of langchainDocs) {
    const response = await ollama.embeddings({
      model: "nomic-embed-text",
      prompt: doc.pageContent, // TODO: embedding할때 (/\n/g, ' ') newline 제거
    });

    // https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/raw-queries#postgresql-typecasting-fixes
    await prismaDB.$executeRaw`
      INSERT INTO "Document" (content, embedding, metadata) 
      VALUES (${doc.pageContent}, ${
      response.embedding
    }::vector ,${JSON.stringify(doc.metadata)}::jsonb);
    `;
  }
};

main();
