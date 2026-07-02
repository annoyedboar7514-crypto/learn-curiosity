import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { getMentorCharacter } from "@/lib/mentor/mentor-characters";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY ?? "",
});

export async function POST(req: NextRequest) {
  const { text, mentorId = "luna" } = await req.json();

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return NextResponse.json({ error: "TTS not configured" }, { status: 503 });
  }

  const mentor = getMentorCharacter(mentorId);

  // Strip any [ESCALATE] prefix or markdown that shouldn't be spoken
  const cleanText = text
    .replace(/^\[ESCALATE\]\s*/i, "")
    .replace(/[*_`#]/g, "")
    .trim();

  try {
    const audioStream = await client.textToSpeech.convert(mentor.elevenLabsVoiceId, {
      text: cleanText,
      model_id: "eleven_turbo_v2_5", // lowest latency model
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.8,
        style: 0.15,
        use_speaker_boost: true,
      },
      output_format: "mp3_44100_128",
    });

    // Collect the stream into a buffer and return as audio
    const chunks: Uint8Array[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[tts]", err);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
