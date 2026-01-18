import { GoogleGenerativeAI } from "@google/generative-ai";
import { Injectable } from "@nestjs/common";
import { ACTIONS } from "./action";

@Injectable()
export class GeminiProvider {
    private genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!)
    private model = this.genAI.getGenerativeModel({
        model: 'gemini-flash-latest',
        systemInstruction: ACTIONS,
        generationConfig: {
        responseMimeType: "application/json",
    }
    })

    async generate(prompt: string){
        const safePrompt = String(prompt);
        const result = await this.model.generateContent({
            contents: [{role: 'user', parts: [{text: safePrompt}]}]
        })
        return result.response.text()
    }
}