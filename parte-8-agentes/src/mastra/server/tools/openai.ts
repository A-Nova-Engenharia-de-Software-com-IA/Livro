import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function speechToTextFromBuffer(buffer: Buffer, mimeType: string) {
  // salva temporariamente (Whisper precisa de file/stream)
  const tmpPath = path.join("/tmp", `audio-${Date.now()}.ogg`);
  await fs.promises.writeFile(tmpPath, buffer);

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(tmpPath),
    model: "gpt-4o-transcribe", // ou "whisper-1" dependendo da sua conta
  });

  await fs.promises.unlink(tmpPath);

  return transcription.text;
}