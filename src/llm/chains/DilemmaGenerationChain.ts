import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { LifeProfile } from '../../types/life';
import { Dilemma } from '../../types/dilemma';

// 🎯 Промпт для генерации дилеммы
const DILEMMA_GENERATION_PROMPT = PromptTemplate.fromTemplate(`
Ты создаёшь **жизненную дилемму**, с которой прямо сейчас сталкивается подросток по имени {name} в возрасте {age} лет.

Вот его текущий психологический портрет:
{lifeContext}

Контекст страны:
{countryContext}

Контекст города/деревни:
{settlementContext}

Контекст семьи:
{familyContext}

Контекст социальное окружение:
{socialContext}

---

Твоя задача — придумать **одну дилемму**, происходящую "здесь и сейчас".  
{name} должен оказаться в ситуации, где ему нужно сделать выбор, и этот выбор будет влиять на его дальнейшую жизнь.

Дилемма должна быть:
- **Реалистичной** — как из настоящей жизни подростка
- **Эмоционально значимой** — затрагивать его страхи, желания, ценности
- **Конкретной** — конкретная ситуация, а не абстрактная проблема
- **Возрастной** — подходящей для {age} лет
- **Контекстной** — связанной с его окружением и обстоятельствами

---

📦 Формат ответа — строго JSON:

{{
  "situation": string (описание ситуации),
  "question": string (вопрос, который задаёт {name}),
  "importance": number (1-10, важность дилеммы),
  "relatedTraits": string[] (какие черты характера затронуты),
  "context": string (дополнительный контекст),
  "stakes": {{
    "immediate": string (что произойдёт сразу),
    "longTerm": string (как это повлияет на будущее),
    "emotional": string (эмоциональные последствия)
  }},
  "choices": [
    {{
      "description": string,
      "pros": string[],
      "cons": string[],
      "alignedTraits": string[],
      "conflictingTraits": string[]
    }}
  ]
}}

⚠️ Только корректный JSON без Markdown, комментариев или заголовков.
`);

// 🎯 Промпт для генерации контекста дилеммы
const CONTEXT_GENERATION_PROMPT = PromptTemplate.fromTemplate(`
Ты создаёшь **контекстную информацию** для дилеммы подростка по имени {name}.

Вот его психологический портрет:
{lifeContext}

---

Сгенерируй контекст, который поможет понять:
1. **Почему эта дилемма возникла именно сейчас?**
2. **Какие события привели к этой ситуации?**
3. **Кто ещё участвует и как они влияют на выбор?**
4. **Какие внешние факторы давят на {name}?**

---

📦 Формат ответа — строго JSON:

{{
  "background": string (что привело к ситуации),
  "participants": [
    {{
      "name": string,
      "role": string,
      "influence": string,
      "expectations": string
    }}
  ],
  "externalPressure": string[] (внешние факторы),
  "timeline": string (когда нужно принять решение),
  "consequences": {{
    "immediate": string[],
    "shortTerm": string[],
    "longTerm": string[]
  }}
}}

⚠️ Только корректный JSON без Markdown, комментариев или заголовков.
`);

export class DilemmaGenerationChain {
  private model: ChatOpenAI;
  private jsonParser: JsonOutputParser;

  constructor(apiKey: string, model = 'gpt-4o-mini') {
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
    this.jsonParser = new JsonOutputParser();
  }

  /**
   * 🎯 Генерация дилеммы с контекстом
   */
  async generateDilemma(
    lifeProfile: LifeProfile,
    countryContext: string,
    settlementContext: string,
    familyContext: string,
    socialContext: string
  ): Promise<Dilemma> {
    try {
      // Формируем контекст жизни
      const lifeContext = this.formatLifeContext(lifeProfile);

      // Генерируем дилемму
      const dilemmaChain = RunnableSequence.from([
        DILEMMA_GENERATION_PROMPT,
        this.model,
        this.jsonParser,
      ]);

      const dilemmaResult = await dilemmaChain.invoke({
        name: lifeProfile.name,
        age: lifeProfile.age,
        lifeContext,
        countryContext,
        settlementContext,
        familyContext,
        socialContext,
      });

      // Генерируем дополнительный контекст
      const contextChain = RunnableSequence.from([
        CONTEXT_GENERATION_PROMPT,
        this.model,
        this.jsonParser,
      ]);

      const contextResult = await contextChain.invoke({
        name: lifeProfile.name,
        lifeContext,
      });

      // Объединяем результаты
      const fullDilemma: Dilemma = {
        situation: dilemmaResult.situation,
        question: dilemmaResult.question,
        importance: dilemmaResult.importance,
        relatedTraits: dilemmaResult.relatedTraits,
        context: contextResult.background,
        stakes: dilemmaResult.stakes,
        choices: dilemmaResult.choices,
        participants: contextResult.participants,
        externalPressure: contextResult.externalPressure,
        timeline: contextResult.timeline,
        consequences: contextResult.consequences,
      };

      console.log('✅ Дилемма сгенерирована:', fullDilemma.situation);
      return fullDilemma;
    } catch (error) {
      console.error('❌ Ошибка генерации дилеммы:', error);
      throw new Error(`Ошибка создания дилеммы: ${error}`);
    }
  }

  /**
   * 📝 Форматирование контекста жизни для промпта
   */
  private formatLifeContext(lifeProfile: LifeProfile): string {
    return `
Имя: ${lifeProfile.name}
Возраст: ${lifeProfile.age}
Пол: ${lifeProfile.gender}

Философия: "${lifeProfile.philosophy}"
Самоописание: "${lifeProfile.selfNarrative}"

Черты характера:
${Object.entries(lifeProfile.coreTraits)
  .map(([trait, value]) => `- ${trait}: ${value}/100`)
  .join('\n')}

Скрытое желание: "${lifeProfile.hiddenDesire}"
Главный страх: "${lifeProfile.coreFear}"
Моральный компас: "${lifeProfile.moralCompass.value}" (устойчивость: ${lifeProfile.moralCompass.stability}/100)
Осознание желания: ${lifeProfile.awarenessLevel}

Культурный контекст:
- Регион: ${lifeProfile.culture.regionName}
- Семейный уклад: ${lifeProfile.culture.household}
- Ценности: ${lifeProfile.culture.values.join(', ')}
- Атмосфера: ${lifeProfile.atmosphere}
    `.trim();
  }
} 