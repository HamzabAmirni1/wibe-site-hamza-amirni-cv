import { createFileRoute } from "@tanstack/react-router";
import { formatGeminiErrorMessage, getGeminiModelInstance } from "@/lib/server/gemini";

const parseJsonPayload = (content: string) => {
  const text = content.trim();
  try {
    return JSON.parse(text);
  } catch (error) {}

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch (error) {}
  }

  const objectBlock = text.match(/\{[\s\S]*\}/);
  if (objectBlock?.[0]) {
    try {
      return JSON.parse(objectBlock[0]);
    } catch (error) {}
  }

  return null;
};

const extractBase64Payload = (value: string) => {
  const matched = value.match(/^data:(.*?);base64,(.*)$/);
  if (matched) {
    return {
      mimeType: matched[1] || "image/jpeg",
      data: matched[2] || "",
    };
  }

  return {
    mimeType: "image/jpeg",
    data: value,
  };
};

export const Route = createFileRoute("/api/resume-import")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { apiKey, model, content, images, locale } = body as {
            apiKey: string;
            model?: string;
            content?: string;
            images?: string[];
            locale?: string;
          };

          if (!apiKey || (!content && (!images || images.length === 0))) {
            return Response.json(
              { error: "Missing API key or resume content/images" },
              { status: 400 }
            );
          }

          const languageMap: Record<string, string> = {
            en: "English",
            fr: "French",
            ar: "Arabic",
          };
          const language = languageMap[locale || "en"] || "English";
          const geminiModel = model || "gemini-flash-latest";
          const imageParts = Array.isArray(images)
            ? images.map((image) => {
                const payload = extractBase64Payload(image);
                return {
                  inlineData: {
                    mimeType: payload.mimeType,
                    data: payload.data,
                  },
                };
              })
            : [];
          const modelInstance = getGeminiModelInstance({
            apiKey,
            model: geminiModel,
            systemInstruction: `You are a professional resume structure assistant. Based on the resume content provided by the user, extract information and output only a valid JSON object.

Output constraints:
1. Only JSON output is allowed. Do not output Markdown, and do not output explanations.
2. If a field is uncertain, use an empty string or an empty array.
3. Please use ${language} for the content text.
4. The description/details fields should be output as an array of strings, with each item being a readable sentence.

JSON structure:
{
  "title": "Resume Title",
  "basic": {
    "name": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "employementStatus": "",
    "birthDate": ""
  },
  "education": [
    {
      "school": "",
      "major": "",
      "degree": "",
      "startDate": "",
      "endDate": "",
      "gpa": "",
      "description": ["", ""]
    }
  ],
  "experience": [
    {
      "company": "",
      "position": "",
      "date": "",
      "details": ["", ""]
    }
  ],
  "projects": [
    {
      "name": "",
      "role": "",
      "date": "",
      "description": ["", ""],
      "link": "",
      "linkLabel": ""
    }
  ],
  "skills": ["", ""]
}`,
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          });

          const inputParts = [
            {
              text:
                content ||
                "Please identify the information in the following resume page image and output it strictly according to the JSON structure.",
            },
            ...imageParts,
          ];

          const result = await modelInstance.generateContent(inputParts);
          const aiContent = result.response.text();

          if (!aiContent || typeof aiContent !== "string") {
            return Response.json(
              { error: "AI did not return structured content" },
              { status: 500 }
            );
          }

          const parsedResume = parseJsonPayload(aiContent);
          if (!parsedResume) {
            return Response.json(
              { error: "Failed to parse AI JSON output" },
              { status: 500 }
            );
          }

          return Response.json({ resume: parsedResume });
        } catch (error) {
          console.error("Error in resume import:", error);
          const status =
            typeof (error as any)?.status === "number"
              ? (error as any).status
              : 500;
          return Response.json(
            { error: formatGeminiErrorMessage(error) },
            { status }
          );
        }
      },
    },
  },
});
