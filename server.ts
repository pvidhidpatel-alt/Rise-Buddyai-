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

// Helper function to format chat messages for Gemini SDK (must start with "user" and alternate roles)
function formatMessagesForGemini(messages: any[]): Array<{ role: string; parts: Array<{ text: string }> }> {
  if (!Array.isArray(messages) || messages.length === 0) {
    return [{ role: "user", parts: [{ text: "Hello RiseBuddy" }] }];
  }

  const raw = messages
    .map((m: any) => {
      const text = String(m.text || m.content || "").trim();
      const role = (m.sender === "user" || m.role === "user") ? "user" : "model";
      return { role, text };
    })
    .filter((m) => m.text.length > 0);

  if (raw.length === 0) {
    return [{ role: "user", parts: [{ text: "Hello RiseBuddy" }] }];
  }

  // Remove leading 'model' messages because Gemini requires contents to start with 'user'
  let startIndex = 0;
  while (startIndex < raw.length && raw[startIndex].role === "model") {
    startIndex++;
  }

  if (startIndex >= raw.length) {
    // If all messages were model messages, use last message text as user input
    const lastText = raw[raw.length - 1].text;
    return [{ role: "user", parts: [{ text: lastText }] }];
  }

  const trimmed = raw.slice(startIndex);

  // Combine adjacent messages with the same role
  const formatted: Array<{ role: string; parts: Array<{ text: string }> }> = [];
  for (const item of trimmed) {
    if (formatted.length > 0 && formatted[formatted.length - 1].role === item.role) {
      formatted[formatted.length - 1].parts[0].text += "\n" + item.text;
    } else {
      formatted.push({
        role: item.role,
        parts: [{ text: item.text }],
      });
    }
  }

  return formatted;
}

// Helper fallback generators when API quota or network issues occur
function getFallbackPlanner(body: any) {
  const { examName, examDate, subjects = [], weakSubjects = [], boringSubjects = [] } = body;
  const s1 = weakSubjects[0] || subjects[0] || "Physics";
  const s2 = boringSubjects[0] || subjects[1] || "Chemistry";
  const s3 = subjects[2] || "Mathematics";
  const s4 = subjects[3] || "General Revision";

  return {
    summary: `Tailored study strategy for ${examName || "Exams"} (${examDate || "Upcoming Date"}). Prime morning slot allocated to weak areas (${s1}), followed by focused pomodoros for ${s2}.`,
    weeklyTip: "💡 Tip: Break tough chapters into 25-minute Pomodoro sprints to prevent fatigue!",
    schedule: [
      {
        timeSlot: "08:00 AM - 09:30 AM",
        type: "study",
        subject: s1,
        topic: "Core Formulas & High-Yield Numerical Practice",
        priority: "HIGH",
        focusNote: "Peak morning focus! Tackle toughest weak-area concepts first.",
        isCompleted: false,
      },
      {
        timeSlot: "09:30 AM - 09:45 AM",
        type: "break",
        subject: "Break",
        topic: "Hydrate, stretch, and relax your eyes",
        priority: "LOW",
        focusNote: "15-minute active recovery buffer",
        isCompleted: false,
      },
      {
        timeSlot: "09:45 AM - 11:00 AM",
        type: "study",
        subject: s2,
        topic: "Bite-Sized Chapter Breakdown & Key Terms",
        priority: "MEDIUM",
        focusNote: "Keep sessions short for challenging/boring subjects",
        isCompleted: false,
      },
      {
        timeSlot: "11:00 AM - 11:45 AM",
        type: "revision",
        subject: s3,
        topic: "Active Recall Flashcards & Formula Quiz",
        priority: "HIGH",
        focusNote: "Self-testing neural retention sprint",
        isCompleted: false,
      },
      {
        timeSlot: "04:00 PM - 05:30 PM",
        type: "study",
        subject: s4,
        topic: "Diagrams, Cheatsheet Notes & Sample Questions",
        priority: "MEDIUM",
        focusNote: "Interactive study block to solidify understanding",
        isCompleted: false,
      },
    ],
  };
}

function getFallbackQuiz(body: any) {
  const { topic = "General Study", subject = "Science", difficulty = "Medium" } = body;
  const qTopic = topic || subject;
  return {
    id: "quiz-" + Date.now(),
    title: `${qTopic} Quiz (${difficulty})`,
    subject: subject,
    difficulty: difficulty,
    questions: [
      {
        id: "q-1",
        question: `Which core principle is central to understanding ${qTopic}?`,
        options: [
          "Conservation Laws & Fundamental Equations",
          "Random Disorientation without Boundary Conditions",
          "Constant Value under Zero Acceleration",
          "Thermal Disruption in Vacuum"
        ],
        correctAnswerIndex: 0,
        explanation: "Conservation laws state that total quantity remains constant in closed systems, forming the core foundation."
      },
      {
        id: "q-2",
        question: `When solving high-frequency numerical questions in ${subject}, what is the recommended first step?`,
        options: [
          "Guess coefficients without checking units",
          "Identify given/unknown variables and write down standard formulas",
          "Skip theoretical definitions completely",
          "Calculate raw numbers without converting to SI units"
        ],
        correctAnswerIndex: 1,
        explanation: "Systematic problem solving starts with listing known values, converting to SI units, and identifying the target equation."
      },
      {
        id: "q-3",
        question: `How does active retrieval testing improve retention for ${qTopic}?`,
        options: [
          "It has zero impact on long-term memory",
          "It forces the brain to rebuild neural memory pathways, boosting recall up to 300%",
          "It causes mental exhaustion without learning benefits",
          "It only works if done passively late at night"
        ],
        correctAnswerIndex: 1,
        explanation: "Retrieval practice forces cognitive effort, which significantly strengthens long-term memory consolidation."
      },
      {
        id: "q-4",
        question: `What is a common trap in ${subject} board exam questions?`,
        options: [
          "Forgetting unit conversions (e.g., minutes to seconds or cm to meters)",
          "Drawing clean diagrams",
          "Writing clear step-by-step working",
          "Checking final answer magnitude"
        ],
        correctAnswerIndex: 0,
        explanation: "Unit mismatch errors account for over 30% of avoidable calculation mistakes in competitive exams."
      },
      {
        id: "q-5",
        question: `Which study strategy yields highest exam score improvements for ${qTopic}?`,
        options: [
          "Passive highlighting of textbooks",
          "Solving past-year practice questions and reviewing error explanations",
          "Cramming 10 hours continuously without breaks",
          "Reading notes without self-testing"
        ],
        correctAnswerIndex: 1,
        explanation: "Analyzing past paper questions helps identify exam patterns and clarifies frequent conceptual traps."
      }
    ],
    createdAt: new Date().toISOString()
  };
}

function getFallbackFlashcards(body: any) {
  const { topic = "Chapter Core", subject = "General" } = body;
  const fTopic = topic || subject;
  return {
    id: "deck-" + Date.now(),
    title: `${fTopic} Study Flashcards`,
    subject: subject,
    cards: [
      {
        id: "fc-1",
        front: `What is the core definition of ${fTopic}?`,
        back: `The fundamental rule governing ${fTopic}, defining how input variables transform into predictable outcomes.`,
        mnemonic: "💡 Think cause and effect in balance!"
      },
      {
        id: "fc-2",
        front: `What key formula or principle is required for ${fTopic}?`,
        back: `Primary Relation: Target = (Variable A × Factor B) / Time Delta. Always ensure standard SI unit alignment.`,
        mnemonic: "🔢 Check units before calculating!"
      },
      {
        id: "fc-3",
        front: `What is the most frequent exam mistake made in ${subject}?`,
        back: `Ignoring sign conventions or boundary limits. Always verify boundary conditions (0, 1, initial state).`,
        mnemonic: "⚠️ Double-check boundary signs!"
      },
      {
        id: "fc-4",
        front: `3-Step Method to solve any numerical in ${fTopic}?`,
        back: `1. List Given & Target\n2. Write Governing Equation\n3. Substitute SI values and compute cleanly.`,
        mnemonic: "🎯 Given → Formula → Compute"
      },
      {
        id: "fc-5",
        front: `Quick Recall: Summary of ${fTopic} in 1 Sentence`,
        back: `${fTopic} coordinates interacting components to maintain system balance while adhering to conservation laws.`,
        mnemonic: "⚡ 1-Sentence Master Summary"
      }
    ],
    createdAt: new Date().toISOString()
  };
}

function getFallbackNotes(body: any) {
  const { topic = "Core Chapter", subject = "General", rawNotes } = body;
  const nTopic = topic || subject || "Revision Notes";

  // If raw notes are provided, split them into clean bullet points
  let extractedPoints: string[] = [];
  if (rawNotes && typeof rawNotes === "string" && rawNotes.trim().length > 0) {
    extractedPoints = rawNotes
      .split(/\n|\./)
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 5);
  }

  const conceptSection1Points = extractedPoints.length >= 2
    ? extractedPoints.slice(0, Math.ceil(extractedPoints.length / 2))
    : [
        `Core Definition: ${nTopic} forms the fundamental basis of ${subject}, establishing predictable mathematical and conceptual relations.`,
        `Primary Governing Principle: Always identify given constraints, target variables, and initial boundary conditions.`,
        `Key takeaway: Distinguish between instantaneous rates and cumulative system quantities.`
      ];

  const conceptSection2Points = extractedPoints.length >= 4
    ? extractedPoints.slice(Math.ceil(extractedPoints.length / 2))
    : [
        `High-Frequency Exam Insight: Written explanations must explicitly connect theoretical steps to final numeric units.`,
        `Problem-Solving Sequence: List known values → Write governing formula → Substitute SI metric units → Double-check sign conventions.`,
        `Memory Anchor: Map abstract concepts in ${nTopic} to real-world physical or computational models.`
      ];

  return {
    id: "note-" + Date.now(),
    title: `ChatGPT-Style High-Yield Notes: ${nTopic}`,
    subject: subject || "General",
    summary: `Comprehensive 5-minute exam revision cheatsheet for ${nTopic}. Synthesizes core principles, critical formulas, and high-yield exam traps for rapid revision.`,
    keyConcepts: [
      {
        title: `1. Core Principles & Fundamentals of ${nTopic}`,
        points: conceptSection1Points
      },
      {
        title: `2. Detailed Problem-Solving & Strategic Insights`,
        points: conceptSection2Points
      }
    ],
    keyFormulasOrDefinitions: [
      `Definition: ${nTopic} - Primary rule governing system behavior under defined environmental parameters.`,
      `Standard Expression: Output = (Primary Input × Growth Rate) / System Impedance`,
      `Required Units: SI Standard (Meters, Seconds, Joules, Volts, Pascals, Kilograms)`
    ],
    examTrapsAndTricks: [
      `⚠️ Trap #1: Forgetting SI unit conversions (e.g. converting minutes to seconds or Celsius to Kelvin).`,
      `💡 Trick: Use dimensional analysis to eliminate physically impossible options in multiple-choice questions!`,
      `⚠️ Trap #2: Ignoring boundary conditions or sign conventions (positive vs negative work/direction).`
    ],
    quickRecallChecklist: [
      `Can you state the core definition of ${nTopic} without looking at notes?`,
      `Do you know the 3 essential formulas and their standard SI units?`,
      `Can you solve a standard past-paper question on ${nTopic} in under 3 minutes?`
    ],
    createdAt: new Date().toISOString()
  };
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
        reply: "I'm RiseBuddy! I'm right here with you to support your study goals and listen whenever you need to chat. How is your day going?",
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

    const formattedContents = formatMessagesForGemini(messages);

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
    const userLastMsg = Array.isArray(req.body?.messages) && req.body.messages.length > 0
      ? req.body.messages[req.body.messages.length - 1]?.text
      : "";

    res.json({
      reply: userLastMsg
        ? `I hear you! I'm here to help you with "${userLastMsg}". Let me know how else I can assist your study session!`
        : "I'm right here with you! Tell me more about what's on your mind today.",
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

    const formattedContents = formatMessagesForGemini(messages);

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
    res.json({
      reply: "💪 Remember: Action creates momentum! Start with just 5 minutes of focused study right now.",
    });
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

    let resultData: any = { summary: "", weeklyTip: "", schedule: [] };
    if (response.text) {
      try {
        resultData = JSON.parse(response.text);
      } catch (e) {
        console.error("JSON parse failed for planner output:", e);
      }
    }

    if (!resultData.schedule || !Array.isArray(resultData.schedule) || resultData.schedule.length === 0) {
      return res.json(getFallbackPlanner(req.body));
    }

    res.json(resultData);
  } catch (err: any) {
    console.error("Error in /api/planner/generate (using fallback):", err?.message || err);
    res.json(getFallbackPlanner(req.body));
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
    console.error("Error in /api/motivation (using fallback):", err?.message || err);
    res.json({
      quote: "🌟 'Success is the sum of small efforts repeated day in and day out.' Keep your momentum strong!",
      actionTip: "Focus on completing just 1 high-priority study chunk right now.",
    });
  }
});

// 4. AI Quiz Generator Endpoint
app.post("/api/quiz/generate", async (req, res) => {
  try {
    const { topic, subject, difficulty, questionCount = 5 } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json(getFallbackQuiz(req.body));
    }

    const systemPrompt = `You are RiseBuddy AI Quiz Master. Generate an engaging, high-yield ${questionCount}-question multiple choice quiz for students preparing for exams.
Difficulty: ${difficulty || "Medium"}.
Subject: ${subject || "General Study"}.
Topic/Notes: ${topic || "Core concepts"}.
Each question MUST have 4 option strings, 0-indexed correctAnswerIndex, and a clear explanatory breakdown.`;

    const userPrompt = `Generate a ${questionCount}-question MCQ quiz for subject '${subject || "Science"}' on topic '${topic}'. Include high-frequency exam questions and conceptual tricks!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "question", "options", "correctAnswerIndex", "explanation"]
              }
            }
          },
          required: ["title", "subject", "difficulty", "questions"]
        }
      }
    });

    let quizObj: any = {};
    if (response.text) {
      try {
        quizObj = JSON.parse(response.text);
      } catch (e) {
        console.error("JSON parse failed for quiz output:", e);
      }
    }

    if (!quizObj.questions || !Array.isArray(quizObj.questions) || quizObj.questions.length === 0) {
      return res.json(getFallbackQuiz(req.body));
    }

    res.json({
      id: "quiz-" + Date.now(),
      title: quizObj.title || `${topic} Quiz`,
      subject: quizObj.subject || subject || "General",
      difficulty: quizObj.difficulty || difficulty || "Medium",
      questions: quizObj.questions,
      createdAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("Error in /api/quiz/generate (using fallback):", err?.message || err);
    res.json(getFallbackQuiz(req.body));
  }
});

// 5. AI Flashcards Generator Endpoint
app.post("/api/flashcards/generate", async (req, res) => {
  try {
    const { topic, subject, cardCount = 6 } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json(getFallbackFlashcards(req.body));
    }

    const systemPrompt = `You are RiseBuddy AI Flashcards Creator. Generate ${cardCount} high-impact study flashcards for quick revision.
Each flashcard MUST have:
- 'front': A clear question, concept, or prompt.
- 'back': Concise, accurate answer, formula, or breakdown.
- 'mnemonic': Optional memory hook or trick to remember easily!`;

    const userPrompt = `Create ${cardCount} flashcards for subject '${subject}' on topic '${topic}'. Focus on high-yield exam points, formulas, definitions, and memory hooks.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  mnemonic: { type: Type.STRING }
                },
                required: ["id", "front", "back"]
              }
            }
          },
          required: ["title", "subject", "cards"]
        }
      }
    });

    let deckObj: any = {};
    if (response.text) {
      try {
        deckObj = JSON.parse(response.text);
      } catch (e) {
        console.error("JSON parse failed for flashcard output:", e);
      }
    }

    if (!deckObj.cards || !Array.isArray(deckObj.cards) || deckObj.cards.length === 0) {
      return res.json(getFallbackFlashcards(req.body));
    }

    res.json({
      id: "deck-" + Date.now(),
      title: deckObj.title || `${topic} Deck`,
      subject: deckObj.subject || subject || "General",
      cards: deckObj.cards,
      createdAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("Error in /api/flashcards/generate (using fallback):", err?.message || err);
    res.json(getFallbackFlashcards(req.body));
  }
});

// 6. AI Revision Notes Maker Endpoint
app.post("/api/notes/generate", async (req, res) => {
  try {
    const { topic, subject, rawNotes } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json(getFallbackNotes(req.body));
    }

    const systemPrompt = `You are RiseBuddy AI Revision Notes Maker. Turn student topics, notes, or chapter topics into ultra-clear, aesthetic, high-yield exam revision cheatsheets.
Structure requirements:
- 'title': Catchy title
- 'subject': Subject name
- 'summary': 2-3 sentence executive summary
- 'keyConcepts': Array of section objects with title & bullet points
- 'keyFormulasOrDefinitions': List of critical formulas/definitions
- 'examTrapsAndTricks': List of sneaky exam traps teachers test on!
- 'quickRecallChecklist': 3-5 rapid self-test questions`;

    const userPrompt = `Create high-yield revision notes for subject '${subject}' on topic '${topic}'. Raw student input/notes context: '${rawNotes || topic}'.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  points: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["title", "points"]
              }
            },
            keyFormulasOrDefinitions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            examTrapsAndTricks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            quickRecallChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "subject", "summary", "keyConcepts", "quickRecallChecklist"]
        }
      }
    });

    let noteObj: any = {};
    if (response.text) {
      try {
        noteObj = JSON.parse(response.text);
      } catch (e) {
        console.error("JSON parse failed for notes output:", e);
      }
    }

    if (!noteObj.keyConcepts || !Array.isArray(noteObj.keyConcepts) || noteObj.keyConcepts.length === 0) {
      return res.json(getFallbackNotes(req.body));
    }

    res.json({
      id: "note-" + Date.now(),
      title: noteObj.title || `${topic} Notes`,
      subject: noteObj.subject || subject || "General",
      summary: noteObj.summary || "",
      keyConcepts: noteObj.keyConcepts,
      keyFormulasOrDefinitions: noteObj.keyFormulasOrDefinitions || [],
      examTrapsAndTricks: noteObj.examTrapsAndTricks || [],
      quickRecallChecklist: noteObj.quickRecallChecklist || [],
      createdAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("Error in /api/notes/generate (using fallback):", err?.message || err);
    res.json(getFallbackNotes(req.body));
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
