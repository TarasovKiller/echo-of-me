import { ChatOpenAI } from '@langchain/openai';
import { LifeGenerationChain } from './chains/LifeGenerationChain';
import { AdviceAnalysisChain } from './chains/AdviceAnalysisChain';
import { DilemmaGenerationChain } from './chains/DilemmaGenerationChain';

export class LangChainFactory {
  private static instance: LangChainFactory;
  private model: ChatOpenAI;
  private lifeChain: LifeGenerationChain;
  private adviceChain: AdviceAnalysisChain;
  private dilemmaChain: DilemmaGenerationChain;

  private constructor(apiKey: string, model = 'gpt-4o-mini') {
    this.model = new ChatOpenAI({
      apiKey,
      model,
      configuration: {
        baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': process.env.HTTP_REFERER || 'http://localhost:3000',
          'X-Title': 'echo-of-me',
        },
      },
    });

    this.lifeChain = new LifeGenerationChain(apiKey, model);
    this.adviceChain = new AdviceAnalysisChain(apiKey, model);
    this.dilemmaChain = new DilemmaGenerationChain(apiKey, model);
  }

  /**
   * 🏭 Получение единственного экземпляра фабрики (Singleton)
   */
  static getInstance(apiKey?: string, model?: string): LangChainFactory {
    if (!LangChainFactory.instance) {
      if (!apiKey) {
        throw new Error('API key required for first initialization');
      }
      LangChainFactory.instance = new LangChainFactory(apiKey, model);
    }
    return LangChainFactory.instance;
  }

  /**
   * 🧬 Получение цепочки генерации личности
   */
  getLifeGenerationChain(): LifeGenerationChain {
    return this.lifeChain;
  }

  /**
   * 🧠 Получение цепочки анализа советов
   */
  getAdviceAnalysisChain(): AdviceAnalysisChain {
    return this.adviceChain;
  }

  /**
   * 🎯 Получение цепочки генерации дилемм
   */
  getDilemmaGenerationChain(): DilemmaGenerationChain {
    return this.dilemmaChain;
  }

  /**
   * 🔧 Получение базовой модели
   */
  getModel(): ChatOpenAI {
    return this.model;
  }

  /**
   * 🔄 Сброс фабрики (для тестирования)
   */
  static reset(): void {
    LangChainFactory.instance = undefined as any;
  }
} 