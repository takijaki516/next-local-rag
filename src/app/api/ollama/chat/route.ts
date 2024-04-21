import { AIPayload, AIStream } from "@/lib/ai-stream";

// export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt, docs } = await req.json();

  if (!prompt) {
    return new Response("prompt is required", { status: 400 });
  }

  const augmentedSystemPrompt = `you are a kind and helpful nutritionist.
Here are some useful resources for you and its delimited by a "*" symbol:
* ${docs[0].content}
* ${docs[1].content}
* ${docs[2].content}
* ${docs[3].content}
* ${docs[4].content}

Do not answer if the question is not related to the above information.
Based on the given information answer users question.
Think step by step and provide clear answer.
This is very important for the user so take your time and try your best to help the user!
`;

  const body: AIPayload = {
    model: "mistral",
    messages: [
      { role: "system", content: augmentedSystemPrompt },
      { role: "user", content: prompt },
    ],
    stream: true,
  };

  const stream = await AIStream(body);

  return new Response(stream, {
    headers: new Headers({ "Cache-Control": "no-cache" }),
  });
}
