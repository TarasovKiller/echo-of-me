// src/llm/OpenAIClient.ts

import OpenAI from 'openai';
import { LLMClient } from '../builders/LifeBuilder';

export class OpenAIClient implements LLMClient {
  private openai: OpenAI;
  private model: string;

  constructor(apiKey: string, model = 'google/gemini-2.0-flash-thinking-exp:free') {
    this.model = model;

    this.openai = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000', // ⚠️ Укажи свой сайт, если хочешь видеть статистику на openrouter.ai
        'X-Title': 'echo-of-me',
      },
    });
  }

  async generate(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'Ты создаёшь психологический профиль ребёнка в формате JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 1.0,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error('OpenRouter вернул пустой ответ');
    }

    return result;
  }
}
