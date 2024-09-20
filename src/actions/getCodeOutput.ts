import fetch from "node-fetch";

export async function getCodeOutput(code: string) {
  const url = new URL(process.env.PISTON_URL ?? "");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: "python",
      version: "3.10.0",
      files: [
        {
          name: "main",
          content: code,
        },
      ],
    }),
  });
  return res;
}
