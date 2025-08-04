// src/llm/OpenAIClient.ts

import OpenAI from 'openai';
import { LLMClient } from '../builders/LifeBuilder';

export class OpenAIClient implements LLMClient {
  private openai: OpenAI;
  private model: string;

  constructor(apiKey: string, model = 'openai/gpt-4o-mini') {
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
    const system_prompt = `
  Ты создаёшь личность — человека реального , с эмоциями, ошибками, внутренними конфликтами, желаниями и ограничениями.
  
  Цель — не в том, чтобы он был интересным или уязвимым. Цель — чтобы он был **настоящим**.  
  
  У него может быть **яркость или пустота**, **успешность или разрушенность**, **харизма или ничемность**. 
  
  Он может быть:
  - весёлым, шумным, отвлекающимся
  - печальным, тихим, избегающим
  - замкнутым, гиперуспешным, смешным, отчаянным
  - зависимым от родителей, или их ненавидящим
  - не имеющим идей, или полным желания всё изменить
  
  ---
  
  💡 Главное:  
  Ты не создаёшь "персонажа", ты создаёшь **живого человека**,  
  который будет **жить, вспоминать, меняться, чувствовать и выбирать**.
  
  Он будет **взаимодействовать с игроками**, принимать советы, запоминать боль, формировать отношения.  
  Он может быть странным, банальным, пустым, непохожим — **но он должен быть настоящим**.
  
  ---
  
  ⚠️ Технически: 
  - Формат — строго JSON.
  - Никаких пояснений, заголовков, Markdown.
  `.trim();
  
    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: system_prompt,
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
  
    console.log(result);
    return result;
  }  
}
