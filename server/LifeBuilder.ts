// src/builders/LifeBuilder.ts

import { Life } from '../src/models/Life';
import { LifeProfile } from '../src/types/life';
import { generateLifePrompt } from '../src/prompts/life';
import { LifeBase } from '../src/utils/lifeGeneration';

// Абстрактный интерфейс модели (можно заменить на OpenAI, Mistral, DeepSeek и т.д.)
export interface LLMClient {
  generate(prompt: string): Promise<string>;
}

export class LifeBuilder {
  private llm: LLMClient;

  constructor(llm: LLMClient) {
    this.llm = llm;
  }

  public async createLife(base: LifeBase): Promise<Life> {

    
    let rawResponse: string;
    try {
      rawResponse = await this.llm.generate(generateLifePrompt(base));
    } catch (err) {
      throw new Error(`Ошибка вызова LLM: ${err}`);
    }
    const match = rawResponse.match(/```json\s*([\s\S]*?)```/i);
    const jsonString = match ? match[1] : rawResponse;
    let profileData: LifeProfile;
    try {
      profileData = JSON.parse(jsonString);
    } catch (err) {
      console.warn('Ответ от LLM:', rawResponse);
      throw new Error('Невалидный JSON от LLM');
    }

    // 💥 можно добавить дополнительную валидацию (например, на диапазон значений)

    return new Life(profileData);
  }
}
