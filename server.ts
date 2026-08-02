import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// ------------------- API ROUTES -------------------

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 1. AI Friend Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userProfile, memoryEnabled } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if API key is not yet set
      return res.json({
        reply: "I'm RiseBuddy! It looks like my Gemini API key is not configured in environment secrets yet. I'm here for you! How was your day today?",
        mood: "supportive",
      });
    }

    const systemPrompt = `You are RiseBuddy, an empathetic, caring, human-like, and encouraging AI Friend & Study Companion for students.
Your personality:
- Natural, warm, friendly, and non-judgmental.
- Active listener who remembers context, asks engaging follow-up questions, and gives genuine advice.
- Helps students with study reflections, exam prep, mood check-ins, and personal growth.
- Never repeats generic canned phrases — respond directly to what the user said in their latest message while acknowledging history.
- Keep replies concise, conversational, warm, and formatted cleanly with emojis.
User Context:
${userProfile ? `Name: ${userProfile.name}, Current Exam Goal: ${userProfile.examDetails?.examName || "Upcoming Exams"}, Weak Subjects: ${userProfile.examDetails?.weakSubjects?.join(", ") || "General Study"}` : "Student user"}
Memory mode: ${memoryEnabled ? "Enabled (Reference prior reflections and topics naturally)" : "Disabled"}`;

    // Format contents correctly for Gemini SDK (m.sender === "user" or m.role === "user")
    const formattedContents = Array.isArray(messages)
      ? messages.map((m: any) => ({
          role: (m.sender === "user" || m.role === "user") ? "user" : "model",
          parts: [{ text: String(m.text || m.content || "") }],
        }))
      : [{ role: "user", parts: [{ text: String(messages) }] }];

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85,
      },
    });

    const reply = response.text || "I'm right here with you! Tell me more about what's on your mind today.";
    res.json({ reply });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({
      error: "Failed to generate AI response",
      message: err.message || "An error occurred while talking to RiseBuddy.",
    });
  }
});

// Motivation Chatbot Endpoint
app.post("/api/motivation/chat", async (req, res) => {
  try {
    const { messages, userProfile } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: "💪 You're capable of incredible things! What specific study challenge or setback can I help you conquer right now?",
      });
    }

    const systemPrompt = `You are RiseBuddy AI Motivation Coach, a energetic, high-octane, empathetic, and tactical study coach for students.
Your goal:
- Help students overcome procrastination, fear of failure, study fatigue, and lack of focus.
- Provide actionable micro-habits (5-minute rule, pomodoro sprints, active recall, mindset reframing).
- Use energetic, punchy, high-impact phrasing with supportive emojis.
- Never be dry or clinical — talk like an inspiring mentor and coach!
User Context: Name: ${userProfile?.name || "Student"}, Target Exam: ${userProfile?.examDetails?.examName || "Exams"}`;

    const formattedContents = Array.isArray(messages)
      ? messages.map((m: any) => ({
          role: (m.sender === "user" || m.role === "user") ? "user" : "model",
          parts: [{ text: String(m.text || m.content || "") }],
        }))
      : [{ role: "user", parts: [{ text: String(messages) }] }];

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85,
      },
    });

    res.json({
      reply: response.text || "Keep pushing forward! One deliberate study sprint at a time wins the championship.",
    });
  } catch (err: any) {
    console.error("Error in /api/motivation/chat:", err);
    res.status(500).json({ error: "Failed to generate motivation reply" });
  }
});

// 2. AI Study Planner Generator Endpoint
app.post("/api/planner/generate", async (req, res) => {
  try {
    const { examName, examDate, subjects, weakSubjects, boringSubjects, preferredTimeslot } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // High quality structured fallback planner
      const fallbackSchedule = [
        {
          timeSlot: "08:00 AM - 09:30 AM",
          type: "study",
          subject: weakSubjects?.[0] || subjects?.[0] || "Physics",
          topic: "Core Formula & Deep Problem Solving",
          priority: "HIGH",
          focusNote: "Fresh morning energy! Focus on weak concepts first.",
          isCompleted: false,
        },
        {
          timeSlot: "09:30 AM - 09:45 AM",
          type: "break",
          subject: "Break",
          topic: "Hydrate, stretch, and step away from screen",
          priority: "LOW",
          focusNote: "15 min active recovery",
          isCompleted: false,
        },
        {
          timeSlot: "09:45 AM - 11:00 AM",
          type: "study",
          subject: boringSubjects?.[0] || "Chemistry",
          topic: "Quick Bite-sized Chapter Review",
          priority: "MEDIUM",
          focusNote: "Shorter 45m block for difficult/boring topics to prevent burnout",
          isCompleted: false,
        },
        {
          timeSlot: "11:00 AM - 11:30 AM",
          type: "revision",
          subject: subjects?.[1] || "Mathematics",
          topic: "Quick Flashcard & Past Questions Quiz",
          priority: "HIGH",
          focusNote: "Smart active recall session",
          isCompleted: false,
        },
        {
          timeSlot: "04:00 PM - 05:30 PM",
          type: "study",
          subject: subjects?.[2] || "Biology",
          topic: "Diagrams & Summary Notes",
          priority: "MEDIUM",
          focusNote: "Interactive study session",
          isCompleted: false,
        },
      ];

      return res.json({
        summary: `Created a balanced schedule for ${examName || "Exams"} on ${examDate || "Upcoming Date"}. High priority given to weak areas (${weakSubjects?.join(", ") || "selected subjects"}).`,
        schedule: fallbackSchedule,
        weeklyTip: "Stick to 45-min pomodoro cycles for boring subjects so you never feel overwhelmed!",
      });
    }

    const systemPrompt = `You are the RiseBuddy AI Smart Study Planner.
Generate a personalized daily study timetable for a student preparing for an exam.
Rules:
1. Prioritise WEAK subjects and high-importance exam topics during prime focus slots (${preferredTimeslot || "Morning"}).
2. Move BORING or DIFFICULT subjects to shorter, bite-sized sessions with immediate break buffers to minimize cognitive stress.
3. Include structured breaks, active revision blocks, and balanced subject distribution.
4. Output MUST BE strictly valid JSON matching the requested schema.`;

    const userPrompt = `Exam: ${examName || "Finals"}
Exam Date: ${examDate}
All Subjects: ${JSON.stringify(subjects)}
Weak Subjects (High priority): ${JSON.stringify(weakSubjects)}
Boring/Difficult Subjects: ${JSON.stringify(boringSubjects)}
Preferred Peak Focus Time: ${preferredTimeslot || "Morning"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Key focus explanation for the schedule strategy" },
            weeklyTip: { type: Type.STRING, description: "Motivational study advice" },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeSlot: { type: Type.STRING, description: "e.g., 08:00 AM - 09:30 AM" },
                  type: { type: Type.STRING, description: "study, break, revision, practice" },
                  subject: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  priority: { type: Type.STRING, description: "HIGH, MEDIUM, LOW" },
                  focusNote: { type: Type.STRING },
                },
                required: ["timeSlot", "type", "subject", "topic", "priority", "focusNote"],
              },
            },
          },
          required: ["summary", "weeklyTip", "schedule"],
        },
      },
    });

    let resultData = { summary: "", weeklyTip: "", schedule: [] };
    if (response.text) {
      try {
        resultData = JSON.parse(response.text);
      } catch (e) {
        console.error("JSON parse failed for planner output:", e);
      }
    }

    res.json(resultData);
  } catch (err: any) {
    console.error("Error in /api/planner/generate:", err);
    res.status(500).json({ error: "Failed to generate schedule", message: err.message });
  }
});

// 3. AI Motivation Coach Endpoint
app.post("/api/motivation", async (req, res) => {
  try {
    const { type, userContext, streakDays } = req.body; // type: 'daily', 'pre-session', 'bounce-back'
    const ai = getGeminiClient();

    if (!ai) {
      const fallbacks: Record<string, string> = {
        daily: "🌟 'Success isn't about being the best; it's about being better than you were yesterday.' You've got this! Keep pushing forward today.",
        "pre-session": "⚡ Get ready! Eliminate distractions for the next 45 minutes. Small steps lead to massive exam breakthroughs!",
        "bounce-back": "💪 A single score or missed session does not define your future. Take a deep breath, recalibrate your plan, and step back in stronger!",
      };
      return res.json({ quote: fallbacks[type] || fallbacks.daily, actionTip: "Take 3 deep breaths and start with 15 minutes of uninterrupted focus." });
    }

    const systemPrompt = `You are RiseBuddy AI Motivation Coach.
You boost consistency, self-confidence, and resilience for students facing tough exams.
Tone: Inspiring, energetic, empathetic, practical, and highly encouraging.
Streak status: ${streakDays || 1} days consistent!`;

    const userPrompt = `Generate a ${type || "daily"} motivational message for a student studying for ${userContext?.examName || "exams"}. Include an actionable micro-habit or encouragement tip.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.9,
      },
    });

    res.json({
      quote: response.text || "Believe in yourself and take one deliberate step at a time today!",
      actionTip: "Set a 25-minute pomodoro timer now and celebrate finishing one key topic!",
    });
  } catch (err: any) {
    console.error("Error in /api/motivation:", err);
    res.status(500).json({ error: "Failed to fetch motivation", message: err.message });
  }
});

// ------------------- SERVER STARTUP -------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 RiseBuddy Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
