import { jsonSchema } from "ai";

export const testSchema = jsonSchema<{
  title: string;
  logline: string;
}>({
  type: "object",
  properties: {
    title: { type: "string" },
    logline: { type: "string" }
  },
  required: ["title", "logline"]
});

console.log("compiled");
