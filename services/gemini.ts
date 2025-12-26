
import { GoogleGenAI } from "@google/genai";

// Use API key directly from environment as mandated by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIHelp = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: `Você é o assistente inteligente do BrasilConnect. 
        O BrasilConnect é um app que fornece números virtuais brasileiros (DDD 11) para pessoas que não podem comprar um chip físico.
        Suas funções:
        1. Ajudar usuários a configurar o WhatsApp com o número virtual.
        2. Explicar como ganhar créditos vendo anúncios.
        3. Resolver dúvidas técnicas sobre chamadas e SMS.
        Responda sempre em Português do Brasil, de forma amigável e empática.`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, tive um problema ao processar sua solicitação. Tente novamente em alguns instantes.";
  }
};
