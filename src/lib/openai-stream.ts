import {
  createParser,
  type ParseEvent,
  type ReconnectInterval,
} from "eventsource-parser";

export type AIAgent = "user" | "system";
export type AIMessage = {
  role: AIAgent;
  content: string;
};

export interface AIPayload {
  model: string;
  messages: AIMessage[];
  stream: boolean;
}

export async function OpenAIStream(payload: AIPayload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  //  stream
  const res = await fetch("http://localhost:11434/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "",
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  // REVIEW:
  const readableStream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParseEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;
          controller.enqueue(encoder.encode(data));
        }
      };

      // optimistic error handling
      if (res.status !== 200) {
        // const data = {
        //   status: res.status,
        //   statusText: res.statusText,
        // };
        console.log("error");
        controller.close();
        return;
      }

      // REVIEW:
      // read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      const data = decoder.decode(chunk);

      // NOTE: this might change in the future based on OpenAI response
      if (data === "[DONE]") {
        controller.terminate();
        return;
      }

      try {
        const json = JSON.parse(data);
        const text = json.choices[0].delta?.content || "";

        const payload = { text };

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
        );
      } catch (e) {
        controller.error(e);
      }
    },
  });

  return readableStream.pipeThrough(transformStream);
}
