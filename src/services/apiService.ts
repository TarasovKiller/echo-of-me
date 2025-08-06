import { LifeProfile } from '../types/life';
import { Dilemma } from '../types/dilemma';
import { AdviceImpact } from '../types/life';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * 🧬 Генерация личности Life
   */
  async generateLife(): Promise<LifeProfile> {
    const response = await fetch(`${this.baseUrl}/api/generate-life`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка генерации Life: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 🎯 Генерация дилеммы
   */
  async generateDilemma(
    lifeProfile: LifeProfile,
    countryContext?: string,
    settlementContext?: string,
    familyContext?: string,
    socialContext?: string
  ): Promise<Dilemma> {
    const response = await fetch(`${this.baseUrl}/api/generate-dilemma`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lifeProfile,
        countryContext,
        settlementContext,
        familyContext,
        socialContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка генерации дилеммы: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 🧠 Анализ влияния одного совета
   */
  async analyzeAdvice(
    advice: string,
    lifeProfile: LifeProfile,
    situation?: string,
    question?: string,
    dilemmaContext?: string
  ): Promise<AdviceImpact & { internalReaction: any; memoryFormation: any }> {
    const response = await fetch(`${this.baseUrl}/api/analyze-advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        advice,
        lifeProfile,
        situation,
        question,
        dilemmaContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка анализа совета: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 🎯 Сравнение и выбор лучшего совета
   */
  async compareAdvices(
    advices: string[],
    lifeProfile: LifeProfile,
    situation?: string,
    question?: string,
    dilemmaContext?: string
  ): Promise<{
    chosenAdviceIndex: number;
    reasoning: string;
    reactions: any[];
    finalDecision: any;
  }> {
    const response = await fetch(`${this.baseUrl}/api/compare-advices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        advices,
        lifeProfile,
        situation,
        question,
        dilemmaContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка сравнения советов: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 🔄 Пакетный анализ всех советов
   */
  async analyzeAllAdvices(
    advices: string[],
    lifeProfile: LifeProfile,
    situation?: string,
    question?: string,
    dilemmaContext?: string
  ): Promise<Array<AdviceImpact & { internalReaction: any; memoryFormation: any }>> {
    const response = await fetch(`${this.baseUrl}/api/analyze-all-advices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        advices,
        lifeProfile,
        situation,
        question,
        dilemmaContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка пакетного анализа: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 🏥 Проверка здоровья сервера
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; langChain: string }> {
    const response = await fetch(`${this.baseUrl}/api/health`);
    
    if (!response.ok) {
      throw new Error(`Ошибка проверки здоровья: ${response.statusText}`);
    }

    return response.json();
  }
}

// Экспорт единственного экземпляра
export const apiService = new ApiService(); 