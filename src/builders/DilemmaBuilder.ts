// src/builders/DilemmaBuilder.ts

import { Dilemma } from '../types/dilemma';
import { makeDilemmaTemplate } from '../prompts/actions';
import { LLMClient } from './LifeBuilder';

export interface DilemmaContext {
  name: string;
  age: number;
  lifeContext: string;
  countryContext: string;
  settlementContext: string;
  familyContext: string;
  socialContext: string;
}

export class DilemmaBuilder {
  private llm: LLMClient;

  constructor(llm: LLMClient) {
    this.llm = llm;
  }

  public async createDilemma(ctx: DilemmaContext): Promise<Dilemma> {
    let rawResponse: string;
    try {
      rawResponse = await this.llm.generate(
        makeDilemmaTemplate(
          ctx.name,
          ctx.age,
          ctx.lifeContext,
          ctx.countryContext,
          ctx.settlementContext,
          ctx.familyContext,
          ctx.socialContext
        )
      );
    } catch (err) {
      throw new Error(`Ошибка вызова LLM: ${err}`);
    }

    const match = rawResponse.match(/```json\s*([\s\S]*?)```/i);
    const jsonString = match ? match[1] : rawResponse;

    let dilemma: Dilemma;
    try {
      dilemma = JSON.parse(jsonString);
    } catch (err) {
      console.warn('Ответ от LLM:', rawResponse);
      throw new Error('Невалидный JSON от LLM');
    }

    return dilemma;
  }
}

