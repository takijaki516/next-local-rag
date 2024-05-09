"use server";

import { Document } from "@prisma/client";
import { prismaDB } from "./prismaDB";

export async function vectorSearch(query: string) {
  try {
    const prompt = {
      model: "nomic-embed-text",
      prompt: query,
    };

    const response = await fetch("http://localhost:11434/api/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompt),
    });

    // TODO: handle error
    if (!response.ok) {
      //
    }

    const { embedding: queryEmbedding } = await response.json();

    const docs = await prismaDB.$queryRaw`
      SELECT 
        id,
        content,
        metadata, 
        1 - (embedding <=> ${queryEmbedding}::vector) as similarity
      FROM
       "Document"
      WHERE 1 - (embedding <=> ${queryEmbedding}::vector) > 0.5
      ORDER BY similarity DESC
      LIMIT 5
    `;

    return docs as Array<Document & { similarity: number }>;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
