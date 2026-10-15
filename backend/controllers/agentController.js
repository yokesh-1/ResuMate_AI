import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

// Tool definitions exposed to the model
const tools = [
  {
    type: "function",
    function: {
      name: "getResume",
      description:
        "Fetch the full resume document for the current user by resumeId.",
      parameters: {
        type: "object",
        properties: {
          resumeId: { type: "string", description: "The resume's id" },
        },
        required: ["resumeId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateResume",
      description:
        "Apply field updates to the current user's resume. Only pass fields that should change (e.g. professional_summary, skills).",
      parameters: {
        type: "object",
        properties: {
          resumeId: { type: "string", description: "The resume's id" },
          updates: {
            type: "object",
            description:
              "Partial resume fields to update, e.g. { professional_summary, skills }",
          },
        },
        required: ["resumeId", "updates"],
      },
    },
  },
];

// Tool implementations, scoped to the authenticated user
const runTool = async (name, args, userId) => {
  if (name === "getResume") {
    const resume = await Resume.findOne({ userId, _id: args.resumeId });
    if (!resume) return { error: "Resume not found" };
    return resume;
  }

  if (name === "updateResume") {
    const resume = await Resume.findOneAndUpdate(
      { userId, _id: args.resumeId },
      args.updates,
      { new: true }
    );
    if (!resume) return { error: "Resume not found" };
    return { success: true, resume };
  }

  return { error: `Unknown tool: ${name}` };
};

// Controller for the resume reviewer / ATS score agent
// POST: /api/ai/review-agent
export const reviewResumeAgent = async (req, res) => {
  try {
    const { resumeId, applyFixes } = req.body;
    const userId = req.userId;

    if (!resumeId) {
      return res.status(400).json({ message: "resumeId is required" });
    }

    const messages = [
      {
        role: "system",
        content: `You are an ATS resume reviewer agent. Steps:
1. Call getResume to read the resume.
2. Analyze it and compute an ATS score from 0-100.
3. Provide concrete, actionable suggestions to improve it.
${
  applyFixes
    ? "4. If improvements are clear and safe (e.g. a stronger professional_summary), call updateResume to apply them."
    : "4. Do NOT modify the resume; only suggest."
}
When finished, respond with ONLY a JSON object:
{ "score": number, "summary": "short overall assessment", "suggestions": ["..."], "applied": boolean }`,
      },
      {
        role: "user",
        content: `Review the resume with id "${resumeId}".`,
      },
    ];

    const MAX_STEPS = 6;
    let applied = false;

    for (let step = 0; step < MAX_STEPS; step++) {
      const response = await ai.chat.completions.create({
        model: process.env.MODEL,
        messages,
        tools,
      });

      const choice = response.choices[0].message;
      messages.push(choice);

      const toolCalls = choice.tool_calls;

      // No tool calls => the agent produced its final answer
      if (!toolCalls || toolCalls.length === 0) {
        let result;
        try {
          result = JSON.parse(choice.content);
        } catch {
          result = { summary: choice.content };
        }
        return res.status(200).json({ ...result, applied });
      }

      // Execute each requested tool and feed results back
      for (const call of toolCalls) {
        const args = JSON.parse(call.function.arguments || "{}");
        const toolResult = await runTool(call.function.name, args, userId);

        if (call.function.name === "updateResume" && toolResult.success) {
          applied = true;
        }

        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(toolResult),
        });
      }
    }

    return res
      .status(200)
      .json({ message: "Agent stopped after max steps", applied });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
