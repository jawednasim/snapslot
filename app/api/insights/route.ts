import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { venueData } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ insights: "AI Insights require GEMINI_API_KEY to be configured." }, { status: 200 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // In a real app we'd fetch actual usage stats from Prisma and send them.
    const prompt = `
      You are an expert sports venue manager and data analyst AI. 
      Analyze the following basic venue data and provide 3 actionable insights to increase revenue and occupancy.
      Format the output as a simple JSON array of strings. No markdown formatting for the JSON.
      
      Venue Data:
      ${JSON.stringify(venueData)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "[]";
    const insights = JSON.parse(text.replace(/```json/g, '').replace(/```/g, ''));

    return NextResponse.json({ insights });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}
