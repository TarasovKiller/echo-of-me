const dotenv = require('dotenv');
dotenv.config();

const { OpenAIClient } = require('../src/llm/OpenAIClient');
const { LifeBuilder } = require('../src/builders/LifeBuilder');
const { generateLifeBase } = require('../src/utils/lifeGeneration');

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY не найден в .env');
    process.exit(1);
  }

  const llm = new OpenAIClient(apiKey);
  const builder = new LifeBuilder(llm);
  const base = generateLifeBase();
  const life = await builder.createLife(base);

  console.log('\n🧠 Профиль Жизни:\n');
  console.log(life.describeSelf());

  console.log('\n📦 JSON-профиль:\n');
  console.dir(life.getProfile(), { depth: null, colors: true });
  
}

main().catch((err) => {
  console.error('🚨 Ошибка:', err);
  process.exit(1);
});

export {}; // 👈 обязательно, чтобы файл считался модулем при isolatedModules
