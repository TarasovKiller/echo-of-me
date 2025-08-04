// constants/prompts.ts

export const valuesTemplateStr = (gender: string, age: number, atmosphere: string): string => `
Ты создаёшь **подростка** — человека реалистичного, эмоционально неоднородного.  
Ты знаешь базовую информацию о нём, и на основе неё — подбираешь имя и ценности.

---

🎯 Твоя задача: пошагово подумать и сгенерировать:
- \`name\`: реалистичное имя, соответствующее полу
- \`values\`: массив из 4–6 **глубинных ценностей**, которые формируют внутренние конфликты, желания, тормоза и мотивации подростка

---

📎 Контекст:
gender: ${gender}
age: ${age}
atmosphere: ${atmosphere}

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
- Не стремись к “правильному человеку” — стремись к **живому**

---

📦 Формат ответа — строго JSON:

{{'{{'}}
  "name": string,
  "values": [
    {{'{{'}}
      "name": string,
      "type": ["instrumental"] или ["terminal"] или оба,
      "source": ["biological", "social", "experience"],
      "category": string (например "Self-Direction"),
      "sphere": ["personal", "interpersonal", "societal"],
      "emotionalTone": "growth_oriented" | "anxiety_based" | "altruistic" | "hedonistic",
      "stability": "low" | "medium" | "high",
      "measurable": true | false,
      "valueScore": число от 20 до 95
    {{'}}'}}
  ]
{{'}}'}}

⚠️ Только корректный JSON без Markdown, комментариев или заголовков.
`.trim();


export const step2TemplateStr = (
  name: string,
  age: number,
  gender: string,
  atmosphere: string,
  values: string // можно вставить JSON-строку с ценностями
): string => `
Ты продолжаешь раскрывать внутренний мир подростка по имени ${name}, возраст — ${age}, пол — ${gender}.  
Сейчас твоя задача — понять, **что в нём уже живёт**: какие качества сформировались, чего он боится, и к чему его тянет.

---

🔹 \`atmosphere\` — это не просто настроение. Это фон, в котором ${name} родился.  
Подумай: в такой среде, чему учатся дети? Что они прячут? Что в них гаснет, а что вырастает?

---

🔹 \`values\` — это как **отголоски среды, семьи, собственного опыта**.  
Вот значения:
${values}

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

🎯 Теперь, на основе всего этого — **раскрой три аспекта личности**:

1. \`coreTraits\` — психологические черты. Это не “баланс характеристик”,  
   а следствие: как он **научился выживать и быть собой**.  
   Черта может быть завышена (\`90\`) не потому что “сильная”, а потому что **компенсация**.  
   Или занижена (\`15\`) — потому что **была подавлена**.  
   Если \`social\` / \`experience\` ценности сильны, это может вызвать:
   - \`shame\`, \`manipulativeness\`, \`guilt\`, \`impulsivity\`

2. \`hiddenDesire\` — **глубинное стремление**, которое не осознаётся до конца.  
   Это не просто цель, а **внутренний вектор**.  
   То, что звучит как: “если бы мне дали шанс, я бы хотел…”  
   Оно связано с \`terminal\`-ценностями, но **никогда не копирует их дословно**

3. \`coreFear\` — не “страх пауков”. А **глубинный тормоз**.  
   Это может быть то, что **мешает** добраться до желания.  
   Часто он вырос из:
   - эмоционального тона (\`${atmosphere}\` → "если я раскроюсь, меня разрушат")
   - \`social\` / \`experience\` источников
   - наблюдений и давления

---

⚠️ Ответ: строго один JSON-объект с полями:

- \`coreTraits\`: объект с числами от 0 до 100 по чертам:
  - \`courage\`, \`empathy\`, \`independence\`, \`guilt\`, \`trust\`,
  - \`impulsivity\`, \`manipulativeness\`, \`shame\`, \`resilience\`
- \`hiddenDesire\`: строка
- \`coreFear\`: строка

---

📘 Пиши как будто ты — психолог, который **чувствует, а не конструирует**.  
Это должно быть **живое описание внутреннего напряжения**, а не “набор параметров”.
`.trim();


export const step3TemplateStr = (
  name: string,
  age: number,
  gender: string,
  context: string // JSON-строка: values, coreTraits, hiddenDesire, coreFear, atmosphere
): string => `
Ты подросток по имени ${name}, возраст — ${age}, пол — ${gender}.
У тебя есть корневые ценности (\`values\`), черты характера (\`coreTraits\`), глубинное желание (\`hiddenDesire\`) и корневой страх (\`coreFear\`).

Важно:
1. Ты **не до конца осознаешь своё глубинное желание** (\`hiddenDesire\`).  
Часто прячешь его за словами, позами, бравадой, простыми объяснениями.  
2. Ты **не осознаешь свой корневой страх** (\`coreFear\`).  
Но как живой человек **подсознательно стараешься избегать его** и не соприкасаться с ним.
3. Черты характера (\`coreTraits\`) являются **средством бегства от страха** (\`coreFear\`).
4. Стиль мышления и написания должен быть соответствующий твоему возрасту.

---

🎯 Сгенерируй 3 поля:

1. 🌀 \`philosophy\` — кредо или поза, с которой ты идешь по жизни.  
Это **не истина**, а то, что ты себе внушаешь, чтобы выжить или выглядеть сильным.  
Это — **щит**. Объяснение, почему "всё нормально", хотя — нет.  
Формат может быть:
- грубым ("мне плевать вообще на всех")
- бравадным, наивным, бытовым
- мудрёным, но без понимания
- логичным, но не ведущим к желанию

2. 🗣 \`selfNarrative\` — как ты говоришь о себе.  
Фраза от первого лица: как будто ты представляешься в компании.  
Примеры:
- вызов: "Я ахуенный пацан."
- защита: "Я норм. Просто лучше не лезь."
- искренность: "Я хочу быть другим, но не знаю как."

Учитывай:
- \`coreTraits\`: если много \`shame\`, \`manipulativeness\` — будет колкий тон
- \`atmosphere\`: "chaotic" → истерично-циничный
- \`coreFear\`: может проступать в голосе

3. 🧠 \`awarenessLevel\` — насколько ты осознаешь своё \`hiddenDesire\`:
- "unconscious" — философия отрицает желание
- "vague" — переплетены, но не осознаны
- "conscious" — почти совпадает, но искажена

---

📎 Контекст:
${context}

---

⚠️ Верни строго JSON-объект:
{
  "philosophy": string,
  "selfNarrative": string,
  "awarenessLevel": "unconscious" | "vague" | "conscious"
}

❌ Без Markdown, заголовков, пояснений. Только JSON.
`.trim();


import { LifeBase } from '../utils/lifeGeneration';

export const generateLifePrompt = (base: LifeBase): string => {
  const step1 = valuesTemplateStr(base.gender, base.age, base.atmosphere);
  const namePlaceholder = '{{name}}';
  const valuesPlaceholder = '{{values}}';
  const step2 = step2TemplateStr(
    namePlaceholder,
    base.age,
    base.gender,
    base.atmosphere,
    valuesPlaceholder
  );
  const context = `{
  "values": ${valuesPlaceholder},
  "coreTraits": {{coreTraits}},
  "hiddenDesire": "{{hiddenDesire}}",
  "coreFear": "{{coreFear}}",
  "atmosphere": "${base.atmosphere}"
}`;
  const step3 = step3TemplateStr(namePlaceholder, base.age, base.gender, context);
  const finalInstruction = `На основе результатов трёх шагов собери единый JSON-объект со всеми полями персонажа: name, gender, age, atmosphere, culture, coreTraits, hiddenDesire, coreFear, philosophy, selfNarrative, awarenessLevel, moralCompass. Ответ только в виде JSON.`;
  return [step1, '', step2, '', step3, '', finalInstruction].join('\n');
};

export const assembleFinalProfilePrompt = (
  step1: any,
  step2: any,
  step3: any
): string => `
Собери итоговый JSON-профиль персонажа на основе трёх этапов. Все поля обязательны:

{
  "name": "${step2.name}",
  "gender": "${step2.gender}",
  "age": ${step2.age},
  "atmosphere": "${step3.culture?.settingStyle ?? 'нейтральная'}",
  "coreTraits": ${JSON.stringify(step2.coreTraits)},
  "hiddenDesire": "${step1.hiddenDesire}",
  "coreFear": "${step1.coreFear}",
  "philosophy": "${step3.philosophy}",
  "selfNarrative": "${step3.selfNarrative}",
  "awarenessLevel": "${step2.awarenessLevel}",
  "culture": ${JSON.stringify(step3.culture)},
  "moralCompass": ${JSON.stringify(step3.moralCompass)}
}

Ответ строго в виде JSON.
`.trim();