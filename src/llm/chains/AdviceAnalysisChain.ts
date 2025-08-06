import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { LifeProfile, AdviceImpact } from '../../types/life';
import { AdviceAnalysisResult, AdviceComparisonResult } from '../../types/advice';

// 🎯 Промпт для анализа влияния совета
const ADVICE_ANALYSIS_PROMPT = PromptTemplate.fromTemplate(`
Ты — внутренний голос подростка по имени {name}, тебе {age} лет.  
Твоя философия: "{philosophy}".

Ты оказался(ась) в ситуации:  
📍 "{situation}"

Ты задал вопрос:  
❓ "{question}"

Контекст дилеммы:
{dilemmaContext}

Ты получил(а) совет:  
💭 "{advice}"

---

Вот твои психологические параметры:
- Главный страх: "{coreFear}"
- Скрытое желание: "{hiddenDesire}"
- Черты характера: {coreTraits}
- Уровень доверия (trust): {trust}
- Моральный компас: "{moralCompass}"
- Осознание желания: {awarenessLevel}

---

📌 Проанализируй, как этот совет влияет на тебя:

1. **Эмоциональная реакция**: Что ты почувствовал(а), когда прочитал(а) этот совет?
2. **Когнитивная оценка**: Как это соотносится с твоими ценностями и убеждениями?
3. **Поведенческая тенденция**: К чему это тебя подталкивает?
4. **Внутренний конфликт**: Есть ли противоречия с твоими страхами или желаниями?

---

📦 Формат ответа — строго JSON:

{{
  "resonanceScore": number (0-100, насколько совет "задел"),
  "matchedTraits": string[] (какие черты характера затронуты),
  "importanceMultiplier": number (1-5, важность совета),
  "emotionalEffect": {{
    "courage": number (-10 до +10),
    "empathy": number (-10 до +10),
    "independence": number (-10 до +10),
    "guilt": number (-10 до +10),
    "trust": number (-10 до +10),
    "impulsivity": number (-10 до +10),
    "manipulativeness": number (-10 до +10),
    "shame": number (-10 до +10),
    "resilience": number (-10 до +10)
  }},
  "soulShift": number (-5 до +5, общее направление развития),
  "internalReaction": {{
    "emotionalResponse": string (описание чувств),
    "cognitiveAssessment": string (мысленная оценка),
    "behavioralTendency": string (к чему склоняешься),
    "conflictLevel": number (0-100, уровень внутреннего конфликта)
  }},
  "memoryFormation": {{
    "willRemember": boolean,
    "emotionalEcho": "затронуло" | "оставило сомнение" | "отвергнуто" | "вдохновило",
    "keyPhrase": string (что запомнится),
    "association": string (с чем свяжешь)
  }}
}}

⚠️ Только корректный JSON без Markdown, комментариев или заголовков.
`);

// 🎯 Промпт для сравнения нескольких советов
const ADVICE_COMPARISON_PROMPT = PromptTemplate.fromTemplate(`
Ты — подросток по имени {name}, тебе {age} лет.  
Твоя философия: "{philosophy}".

Ты оказался(ась) в ситуации:  
📍 "{situation}"

Ты задал вопрос:  
❓ "{question}"

Контекст дилеммы:
{dilemmaContext}

Вот советы, которые ты получил(а):  
{adviceList}

---

Вот твои психологические параметры:
- Главный страх: "{coreFear}"
- Скрытое желание: "{hiddenDesire}"
- Черты характера: {coreTraits}
- Уровень доверия (trust): {trust}
- Моральный компас: "{moralCompass}"
- Осознание желания: {awarenessLevel}

---

📌 Проанализируй каждый совет и выбери тот, который больше всего резонирует с тобой:

1. Какой совет лучше всего соответствует твоему скрытому желанию?
2. Какой совет меньше всего затрагивает твои страхи?
3. Какой совет больше всего поддерживает твою философию?
4. Какой совет даёт тебе больше всего сил и уверенности?

---

📦 Формат ответа — строго JSON:

{{
  "chosenAdviceIndex": number (индекс выбранного совета, начиная с 0),
  "reasoning": string (почему выбрал именно этот совет),
  "reactions": [
    {{
      "adviceIndex": number,
      "resonanceScore": number (0-100),
      "resonatesWith": {{
        "desire": boolean,
        "fear": boolean,
        "philosophy": boolean
      }},
      "emotionalEffect": {{ "trait": number, ... }},
      "soulVectorChange": number,
      "reactionText": string,
      "reasoningLog": [string]
    }}
  ],
  "finalDecision": {{
    "chosenAdvice": string,
    "confidence": number (0-100),
    "emotionalState": string,
    "expectedOutcome": string
  }}
}}

⚠️ Только корректный JSON без Markdown, комментариев или заголовков.
`);

export class AdviceAnalysisChain {
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
   * 🧠 Анализ влияния одного совета
   */
  async analyzeSingleAdvice(
    advice: string,
    lifeProfile: LifeProfile,
    situation: string,
    question: string,
    dilemmaContext: string
  ): Promise<AdviceAnalysisResult> {
    const analysisChain = RunnableSequence.from([
      ADVICE_ANALYSIS_PROMPT,
      this.model,
      this.jsonParser,
    ]);

    const result = await analysisChain.invoke({
      name: lifeProfile.name,
      age: lifeProfile.age,
      philosophy: lifeProfile.philosophy,
      situation,
      question,
      dilemmaContext,
      advice,
      coreFear: lifeProfile.coreFear,
      hiddenDesire: lifeProfile.hiddenDesire,
      coreTraits: JSON.stringify(lifeProfile.coreTraits),
      trust: lifeProfile.coreTraits.trust,
      moralCompass: lifeProfile.moralCompass.value,
      awarenessLevel: lifeProfile.awarenessLevel,
    }) as AdviceAnalysisResult;

    return result;
  }

  /**
   * 🎯 Сравнение и выбор лучшего совета
   */
  async compareAndChooseAdvice(
    advices: string[],
    lifeProfile: LifeProfile,
    situation: string,
    question: string,
    dilemmaContext: string
  ): Promise<AdviceComparisonResult> {
    const comparisonChain = RunnableSequence.from([
      ADVICE_COMPARISON_PROMPT,
      this.model,
      this.jsonParser,
    ]);

    const adviceList = advices
      .map((advice, index) => `${index + 1}. ${advice}`)
      .join('\n');

    const result = await comparisonChain.invoke({
      name: lifeProfile.name,
      age: lifeProfile.age,
      philosophy: lifeProfile.philosophy,
      situation,
      question,
      dilemmaContext,
      adviceList,
      coreFear: lifeProfile.coreFear,
      hiddenDesire: lifeProfile.hiddenDesire,
      coreTraits: JSON.stringify(lifeProfile.coreTraits),
      trust: lifeProfile.coreTraits.trust,
      moralCompass: lifeProfile.moralCompass.value,
      awarenessLevel: lifeProfile.awarenessLevel,
    }) as AdviceComparisonResult;

    return result;
  }

  /**
   * 🔄 Пакетный анализ всех советов
   */
  async analyzeAllAdvices(
    advices: string[],
    lifeProfile: LifeProfile,
    situation: string,
    question: string,
    dilemmaContext: string
  ): Promise<AdviceAnalysisResult[]> {
    const analysisPromises = advices.map(advice =>
      this.analyzeSingleAdvice(advice, lifeProfile, situation, question, dilemmaContext)
    );

    return Promise.all(analysisPromises);
  }
} 