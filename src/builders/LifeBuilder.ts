// src/builders/LifeBuilder.ts

import { Life } from '../models/Life';
import { LifeProfile } from '../types/life';
import { valuesTemplateStr } from '../prompts/life';
import { step2TemplateStr } from '../prompts/life';
import { step3TemplateStr } from '../prompts/life';
import { assembleFinalProfilePrompt } from '../prompts/life';
import { LifeBase } from '../utils/lifeGeneration';

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
    try {
      // Шаг 1: генерация ценностей
      const step1Prompt = valuesTemplateStr(base.gender,base.age,base.atmosphere);
      const valuesJson = await this.extractJsonFromLLM(step1Prompt);
      console.log(valuesJson);
      console.log(valuesJson.values);
      
      // Шаг 2: генерация имени и черт
      const step2Prompt = step2TemplateStr(valuesJson.name,base.age, base.gender, base.atmosphere, valuesJson.values);
      const traitsJson = await this.extractJsonFromLLM(step2Prompt);
      
      return new Life(traitsJson);
      // // Шаг 3: генерация философии и культуры
      // const step3Prompt = step3TemplateStr(base, valuesJson, traitsJson);
      // const contextJson = await this.extractJsonFromLLM(step3Prompt);

      // // Сборка финального JSON
      // const finalPrompt = assembleFinalProfilePrompt(valuesJson, traitsJson, contextJson);
      // const finalJson = await this.extractJsonFromLLM(finalPrompt);

      // return new Life(finalJson as LifeProfile);
    } catch (err) {
      throw new Error(`Ошибка создания Life: ${err}`);
    }
  }

  private async extractJsonFromLLM(prompt: string): Promise<any> {
    const raw = await this.llm.generate(prompt);
    const match = raw.match(/```json\s*([\s\S]*?)```/i);
    const jsonString = match ? match[1] : raw;
    return JSON.parse(jsonString);
  }
}