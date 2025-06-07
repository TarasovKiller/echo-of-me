export const makeEventTemplate = (
    name: string,
    age: number,
    lifeContext: string,
    countryContext: string,
    settlementContext: string,
    familyContext: string,
    socialContext: string
  ): string => `
  Ты продолжаешь рассказывать историю подростка по имени ${name} c возрастом ${age} лет.
  
  Вот её текущий психологический портрет:
  ${lifeContext}
  
  Контекст страны:
  ${countryContext}
  
  Контекст города/деревни:
  ${settlementContext}
  
  Контекст семьи:
  ${familyContext}
  
  Контекст социальное окружение:
  ${socialContext}
  
  ---
  
  📌 Прежде чем сгенерировать событие, обдумай последовательно:
  
  1. Какая сейчас **внутренняя динамика** подростка? Что ему важно, чего он боится, чего хочет? Какие фразы он говорит себе про себя?
  2. Где он находится — физически и социально? Что здесь **нормально**, а что **вызывает напряжение**?
  3. Какое событие может быть **правдоподобным**, не слишком большим, но оставить **глубокий эмоциональный след**?
  4. Кто участвует в сцене — из кого-то, кто уже есть в окружении подростка?
  5. Что изменится в нём после этого события? Какие **убеждения или стратегии** закрепятся или пошатнутся?
  
  ---
  
  Теперь сгенерируй **одно событие**, которое может произойти с ${name} в его текущем возрасте (${age} лет).
  
  Оно должно быть:
  - связано с его внутренним состоянием (черты, страхи, желания)
  - обусловлено его окружением (семья, школа, друзья, город)
  - психологически правдоподобным — **как из настоящей жизни**
  - не шаблонным, но и не вычурным
  - желательно — локальным: событие, которое **запомнится, но не станет катастрофой**
  
  Варианты типов события:
  - "memory" — воспоминание, которое закрепится
  - "dilemma" — ситуация выбора между ценностями
  - "trauma" — утрата, страх, отвержение
  - "growth" — постепенное изменение отношения к себе или миру
  
  ---
  
  Формат ответа (строго 1 событие, в валидном JSON):
  
  {
    "id": string,
    "age": number,
    "title": string,
    "type": "memory" | "dilemma" | "trauma" | "growth",
    "description": string,
    "peopleInvolved": string[],
    "location": string,
    "linkedToEventId": string | null,
    "impactHint": string
  }
  
  ⚠️ Строго соблюдай JSON-структуру. Без Markdown, пояснений или обёртки.
  `.trim();

  
  export const makeDilemmaTemplate = (
    name: string,
    age: number,
    lifeContext: string,
    countryContext: string,
    settlementContext: string,
    familyContext: string,
    socialContext: string
  ): string => `
  Ты создаёшь **жизненную дилемму**, с которой прямо сейчас сталкивается подросток по имени ${name} в возрасте ${age} лет.
  
  Вот его текущий психологический портрет:
  ${lifeContext}
  
  Контекст страны:
  ${countryContext}
  
  Контекст города/деревни:
  ${settlementContext}
  
  Контекст семьи:
  ${familyContext}
  
  Контекст социальное окружение:
  ${socialContext}
  
  ---
  
  Твоя задача — придумать **одну дилемму**, происходящую "здесь и сейчас".  
  ${name} не вспоминает — он **стоит внутри ситуации** и не знает, что делать.
  
  Событие может быть:
  - правдоподобным, укоренённым в окружении (город, семья, школа, друзья)
  - соотнесённым с внутренним состоянием подростка (страх, черты, скрытое желание)
  - не катастрофическим, но таким, чтобы **оставить эмоциональный след**
  - требующим **морального или личного выбора** (не обязательно "правильного")
  
  Тип ситуации: **"Что мне сделать?"** — а не "Что я сделал?"
  
  ---
  
  Формат ответа (только валидный JSON, одна дилемма):
  
  {
    "id": string,
    "age": number,
    "title": string,
    "type": "dilemma",
    "situation": string,
    "question": string,
    "location": string,
    "peopleInvolved": string[],
    "relatedTraits": string[],
    "importance": number,
    "resonatesWith": {
      "coreFear": boolean,
      "hiddenDesire": boolean
    }
  }
  
  ⚠️ Ответ строго в JSON. Без Markdown, заголовков или пояснений.
  `.trim();
  

  export const adviceReactionTemplate = (
    name: string,
    age: number,
    philosophy: string,
    situation: string,
    question: string,
    dilemmaContext: string,
    adviceList: string,
    coreFear: string,
    hiddenDesire: string,
    coreTraits: string,
    trust: number
  ): string => `
  Ты — подросток по имени ${name}, тебе ${age} лет.  
  Твоя философия: "${philosophy}".
  
  Ты оказался(ась) в ситуации:  
  📍 "${situation}"
  
  Ты задал вопрос:  
  ❓ "${question}"
  
  Контекст дилеммы:
  ${dilemmaContext}
  
  Вот советы, которые ты получил(а):  
  ${adviceList}
  
  ---
  
  Вот твои психологические параметры:
  - Главный страх: "${coreFear}"
  - Скрытое желание: "${hiddenDesire}"
  - Черты характера: ${coreTraits}
  - Уровень доверия (trust): ${trust}
  
  ---
  
  📌 Прежде чем отвечать, подумай про каждый совет:
  
  1. Что ты почувствовал(а), когда его прочитал(а)?
  2. Это совпадает с твоим желанием или идёт вразрез со страхом?
  3. Противоречит ли он твоей философии?
  4. Какие черты он затрагивает и как (усиливает или ослабляет)?
  5. Влияет ли это на твоё доверие к тому, кто это сказал?
  
  ---
  
  Ответ — строго в формате массива JSON-объектов (по одному на каждый совет):
  [
    {
      "advice": string,
      "resonanceScore": number,
      "resonatesWith": {
        "desire": boolean,
        "fear": boolean,
        "philosophy": boolean
      },
      "emotionalEffect": { "trait": number, ... },
      "soulVectorChange": number,
      "relationshipDelta": number,
      "reactionText": string,
      "reasoningLog": [
        string
      ]
    },
    ...
  ]
  
  ⚠️ Ответ только JSON. Без Markdown, заголовков, кавычек вокруг массива или пояснений.
  `.trim();
  