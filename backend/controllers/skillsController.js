import ai from "../configs/ai.js";

// Controller for suggesting skills based on profession and experience
// POST: /api/ai/suggest-skills
export const suggestSkills = async (req, res) => {
  try {
    const { profession, experience, existingSkills } = req.body;

    if (!profession && (!experience || experience.length === 0)) {
      return res
        .status(400)
        .json({ message: "Provide a profession or some experience" });
    }

    // build a readable context from experience entries
    const experienceText = Array.isArray(experience)
      ? experience
          .map(
            (exp) =>
              `${exp.position || ""} at ${exp.company || ""}: ${
                exp.description || ""
              }`
          )
          .join("\n")
      : "";

    const userContent = `Profession: ${profession || "N/A"}
Experience:
${experienceText || "N/A"}
Skills already added: ${
      Array.isArray(existingSkills) && existingSkills.length
        ? existingSkills.join(", ")
        : "none"
    }`;

    const response = await ai.chat.completions.create({
      model: process.env.MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume and career advisor. Based on the user's profession and experience, suggest 8-12 relevant, ATS-friendly skills (a mix of technical and soft skills). Do NOT repeat skills the user already added. Return ONLY a JSON object in this exact format with no extra text: { \"skills\": [\"skill1\", \"skill2\"] }",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    const skills = Array.isArray(parsed.skills) ? parsed.skills : [];

    return res.status(200).json({ skills });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
