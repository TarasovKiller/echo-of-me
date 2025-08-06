import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { LifeBase } from '../../utils/lifeGeneration';
import { LifeProfile } from '../../types/life';

// 🎯 Шаг 1: Генерация ценностей и имени
const VALUES_PROMPT = PromptTemplate.fromTemplate(`
Ты создаёшь **подростка** — человека реалистичного, эмоционально неоднородного.  
Ты знаешь базовую информацию о нём, и на основе неё — подбираешь имя и ценности.

---

🎯 Твоя задача: пошагово подумать и сгенерировать:
- \`name\`: реалистичное имя, соответствующее полу
- \`values\`: массив из 4–6 **глубинных ценностей**, которые формируют внутренние конфликты, желания, тормоза и мотивации подростка

---

📎 Контекст:
gender: {gender}
age: {age}
atmosphere: {atmosphere}

---

🧠 Подумай пошагово (Chain of Thought):
1. Как атмосфера влияет на восприятие мира?
2. Какие страхи или настроения могут возникнуть при таком возрасте и фоне?
3. Какие типы ценностей могли сформироваться?
4. Какие из них сильные, но подавленные? Какие слабые, но мешают?
5. Какой баланс между terminal и instrumental?
6. Почему именно эти \`valueScore\`?

---

⚠️ Обрати внимание:
- \`atmosphere\` задаёт **эмоциональный тон восприятия мира**
- \`gender\` и \`age\` могут влиять на сферы проявления ценностей
- Не стремись к "правильному человеку" — стремись к **живому**

---

📦 Формат ответа — строго JSON:

{{
  "name": string,
  "values": [
    {{
      "name": string,
      "type": ["instrumental"] или ["terminal"] или оба,
      "source": ["biological", "social", "experience"],
      "category": string (например "Self-Direction"),
      "sphere": ["personal", "interpersonal", "societal"],
      "emotionalTone": "growth_oriented" | "anxiety_based" | "altruistic" | "hedonistic",
      "stability": "low" | "medium" | "high",
      "measurable": true | false,
      "valueScore": число от 20 до 95
    }}
  ]
}}

⚠️ Только корректный JSON без Markdown, комментариев или заголовков.
`);

// 🎯 Шаг 2: Генерация черт характера
const TRAITS_PROMPT = PromptTemplate.fromTemplate(`
Ты продолжаешь раскрывать внутренний мир подростка по имени {name}, возраст — {age}, пол — {gender}.  
Сейчас твоя задача — понять, **что в нём уже живёт**: какие качества сформировались, чего он боится, и к чему его тянет.

---

🔹 \`atmosphere\` — это не просто настроение. Это фон, в котором {name} родился.  
Подумай: в такой среде, чему учатся дети? Что они прячут? Что в них гаснет, а что вырастает?

---

🔹 \`values\` — это как **отголоски среды, семьи, собственного опыта**.  
Вот значения:
{values}

Для каждой ценности обрати внимание:

- \`valueScore\` → насколько сильно эта ценность влияет на поведение
- \`emotionalTone\` → как она связана с чувствами:
  - \`growth_oriented\` → он может хотеть измениться
  - \`anxiety_based\` → он может бояться что-то потерять
  - \`altruistic\` → он может не замечать себя
  - \`hedonistic\` → он может искать радость в пустоте

- \`type\`:
  - \`terminal\` → чаще лежит в основе \`hiddenDesire\`
  - \`instrumental\` → влияет на поведение (\`coreTraits\`)

- \`source\`:
  - \`biological\` → может проявляться даже без осознания
  - \`social\` / \`experience\` → часто создают \`shame\`, \`guilt\`, \`fear\`

---

🎯 Сгенерируй JSON с полями:

{{
  "coreTraits": {{
    "courage": number (0-100),
    "empathy": number (0-100),
    "independence": number (0-100),
    "guilt": number (0-100),
    "trust": number (0-100),
    "impulsivity": number (0-100),
    "manipulativeness": number (0-100),
    "shame": number (0-100),
    "resilience": number (0-100)
  }},
  "hiddenDesire": string,
  "coreFear": string,
  "awarenessLevel": "conscious" | "vague" | "unconscious"
}}

⚠️ Только корректный JSON без Markdown, комментариев или заголовков.
`);

// 🎯 Шаг 3: Генерация философии и культуры
const PHILOSOPHY_PROMPT = PromptTemplate.fromTemplate(`
Ты подросток по имени {name}, возраст — {age}, пол — {gender}.
У тебя есть корневые ценности (\`values\`), черты характера (\`coreTraits\`), глубинное желание (\`hiddenDesire\`) и корневой страх (\`coreFear\`).

Важно:
1. Ты **не до конца осознаешь своё глубинное желание** (\`hiddenDesire\`).  
Часто прячешь его за словами, позами, бравадой, простыми объяснениями.  
2. Ты **не осознаешь свой корневой страх** (\`coreFear\`).  
Но как живой человек **подсознательно стараешься избегать его** и не соприкасаться с ним.
3. Черты характера (\`coreTraits\`) являются **средством бегства от страха** (\`coreFear\`).
4. Стиль мышления и написания должен быть соответствующий твоему возрасту.

---

🎯 Сгенерируй 5 полей:

1. 🌀 \`philosophy\` — твоя философия жизни (1-2 предложения, как ты объясняешь себе мир)
2. 🪞 \`selfNarrative\` — как ты рассказываешь о себе другим (1-2 предложения)
3. 🏠 \`culture\` — описание твоей семьи и окружения:
   {{
     "regionName": string,
     "household": string,
     "values": string[],
     "settingStyle": string
   }}
4. 🧭 \`moralCompass\` — твои этические принципы:
   {{
     "value": string,
     "origin": "cultural" | "learned" | "trauma-based",
     "stability": number (0-100)
   }}
5. 🧠 \`awarenessLevel\` — насколько ты осознаёшь свои желания и страхи

---

📦 Формат ответа — строго JSON:

{{
  "philosophy": string,
  "selfNarrative": string,
  "culture": {{
    "regionName": string,
    "household": string,
    "values": string[],
    "settingStyle": string
  }},
  "moralCompass": {{
    "value": string,
    "origin": "cultural" | "learned" | "trauma-based",
    "stability": number
  }},
  "awarenessLevel": "conscious" | "vague" | "unconscious"
}}

⚠️ Только корректный JSON без Markdown, комментариев или заголовков.
`);

export class LifeGenerationChain {
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
   * 🧬 Создание полной личности через последовательную цепочку
   */
  async generateLife(base: LifeBase): Promise<LifeProfile> {
    try {
      // Шаг 1: Генерация ценностей и имени
      const valuesChain = RunnableSequence.from([
        VALUES_PROMPT,
        this.model,
        this.jsonParser,
      ]);

      const step1Result = await valuesChain.invoke({
        gender: base.gender,
        age: base.age,
        atmosphere: base.atmosphere,
      });

      console.log('✅ Шаг 1 завершён:', step1Result.name);

      // Шаг 2: Генерация черт характера
      const traitsChain = RunnableSequence.from([
        TRAITS_PROMPT,
        this.model,
        this.jsonParser,
      ]);

      const step2Result = await traitsChain.invoke({
        name: step1Result.name,
        age: base.age,
        gender: base.gender,
        atmosphere: base.atmosphere,
        values: JSON.stringify(step1Result.values),
      });

      console.log('✅ Шаг 2 завершён:', step2Result.hiddenDesire);

      // Шаг 3: Генерация философии и культуры
      const philosophyChain = RunnableSequence.from([
        PHILOSOPHY_PROMPT,
        this.model,
        this.jsonParser,
      ]);

      const step3Result = await philosophyChain.invoke({
        name: step1Result.name,
        age: base.age,
        gender: base.gender,
        values: JSON.stringify(step1Result.values),
        coreTraits: JSON.stringify(step2Result.coreTraits),
        hiddenDesire: step2Result.hiddenDesire,
        coreFear: step2Result.coreFear,
        atmosphere: base.atmosphere,
      });

      console.log('✅ Шаг 3 завершён:', step3Result.philosophy);

      // Сборка итогового профиля
      const finalProfile: LifeProfile = {
        name: step1Result.name,
        gender: base.gender,
        age: base.age,
        atmosphere: base.atmosphere,
        culture: step3Result.culture,
        coreTraits: step2Result.coreTraits,
        hiddenDesire: step2Result.hiddenDesire,
        coreFear: step2Result.coreFear,
        philosophy: step3Result.philosophy,
        selfNarrative: step3Result.selfNarrative,
        awarenessLevel: step3Result.awarenessLevel,
        moralCompass: step3Result.moralCompass,
      };

      return finalProfile;
    } catch (error) {
      console.error('❌ Ошибка в цепочке генерации Life:', error);
      throw new Error(`Ошибка создания Life: ${error}`);
    }
  }
} 