export const maxDuration = 60;
import connectDB from '@/config/db';
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Chat from "@/models/Chat";

// 1. Initialize the OpenAI client here (this was missing!)
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
    try {
        const {userId} = getAuth(req);
        const {chatId, prompt} = await req.json();

        if(!userId){
            return NextResponse.json({success: false, error: "Unauthorized"});
        }
        
        await connectDB();
        const data = await Chat.findOne({userId, _id: chatId});

        if (!data) {
             return NextResponse.json({success: false, error: "Chat not found"});
        }

        const userPrompt = {
            role: "user",
            content: prompt,
            timestamp: Date.now()
        };

        data.messages.push(userPrompt);

        // 2. The API call must be inside the POST function!
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt,
                }
            ],
            // 3. Using the foolproof free model auto-router
            model: 'openrouter/free', 
        });

        const message = completion.choices[0].message;
        message.timestamp = Date.now();
        data.messages.push(message);
        
        await data.save();

        return NextResponse.json({success: true, data: message});

    } catch(error){
        console.error("API Error: ", error); // Helpful for your server logs
        return NextResponse.json({success: false, error: error.message});
    }
}