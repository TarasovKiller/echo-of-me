export const makeSocialTemplate = (
    name: string,
    lifeContext: string,
    countryContext: string,
    settlementContext: string,
    familyContext: string
  ): string => `
  Ты создаёшь **социальное окружение подростка по имени ${name}** — несемейных людей, которые повлияли на его становление.
  
  Это могут быть:
  - друзья (настоящие или условные),
  - враги, буллеры, подстрекатели,
  - случайные, но значимые знакомые,
  - учителя, тренеры, наставники,
  - бывшие друзья, конкуренты, объект влюблённости.
  
  Твоя цель — описать **2–5 значимых фигур**, которые:
  - оставили психологический след (позитивный или травматичный),
  - представляют разные формы взаимодействия (соперничество, зависимость, обожествление, презрение),
  - **соотносятся с личностью ${name}** и тем, что мы знаем о его ценностях (\`values\`), чертах (\`coreTraits\`), страхах (\`coreFear\`), желаниях (\`hiddenDesire\`).
  
  Контекст подростка:
  ${lifeContext}
  
  Контекст страны:
  ${countryContext}
  
  Контекст города/деревни:
  ${settlementContext}
  
  Контекст семьи:
  ${familyContext}
  
  Ответ строго в виде JSON-массива. Формат:
  
  [
    {
      "type": "friend" | "classmate" | "bully" | "mentor" | "ex-friend" | "rival" | "follower" | string,
      "name": string,
      "age": number,
      "traits": string[],
      "bondWithLife": string,
      "importance": "low" | "medium" | "high",
      "groupContext": string,
      "triggersLifeFear": boolean,
      "resonatesWithDesire": boolean,
      "note": string
    }
  ]
  
  ⚠️ Только JSON. Без Markdown, комментариев или пояснений.
  `.trim();
  