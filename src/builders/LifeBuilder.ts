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
      const step2Prompt = step2TemplateStr(
        valuesJson.name,
        base.age,
        base.gender,
        base.atmosphere,
        JSON.stringify(valuesJson.values)
      );
      const step2Json = await this.extractJsonFromLLM(step2Prompt);

      // Шаг 3: генерация философии и культуры
      const contextForStep3 = JSON.stringify({
        values: valuesJson.values,
        coreTraits: step2Json.coreTraits,
        hiddenDesire: step2Json.hiddenDesire,
        coreFear: step2Json.coreFear,
        atmosphere: base.atmosphere,
      });
      const step3Prompt = step3TemplateStr(
        valuesJson.name,
        base.age,
        base.gender,
        contextForStep3
      );
      const step3Json = await this.extractJsonFromLLM(step3Prompt);

      // Сборка итогового профиля
      const finalProfile: LifeProfile = {
        name: valuesJson.name,
        gender: base.gender,
        age: base.age,
        atmosphere: base.atmosphere,
        culture: step3Json.culture,
        coreTraits: step2Json.coreTraits,
        hiddenDesire: step2Json.hiddenDesire,
        coreFear: step2Json.coreFear,
        philosophy: step3Json.philosophy,
        selfNarrative: step3Json.selfNarrative,
        awarenessLevel: step3Json.awarenessLevel,
        moralCompass: step3Json.moralCompass,
      };

      return new Life(finalProfile);
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