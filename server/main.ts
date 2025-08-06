const dotenv = require('dotenv');
dotenv.config();

import { LangChainFactory } from '../src/llm/LangChainFactory';
import { generateLifeBase } from '../src/utils/lifeGeneration';
import { Life } from '../src/models/Life';

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY не найден в .env');
    process.exit(1);
  }

  try {
    // Инициализация LangChain фабрики
    const langChainFactory = LangChainFactory.getInstance(apiKey);
    const lifeChain = langChainFactory.getLifeGenerationChain();
    
    // Генерация базовых параметров
    const base = generateLifeBase();
    console.log('🎲 Базовые параметры:', base);
    
    // Генерация полной личности через LangChain
    const lifeProfile = await lifeChain.generateLife(base);
    
    // Создание экземпляра Life для дополнительных методов
    const life = new Life(lifeProfile);

    console.log('\n🧠 Профиль Жизни:\n');
    console.log(life.describeSelf());

    console.log('\n📦 JSON-профиль:\n');
    console.dir(life.getProfile(), { depth: null, colors: true });
    
    console.log('\n🔮 Вектор души:', life.getSoulVector());
    console.log('🧭 Моральный компас:', life.getMoralCompass());
    
  } catch (error) {
    console.error('🚨 Ошибка:', error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('🚨 Критическая ошибка:', err);
  process.exit(1);
});

export {}; // 👈 обязательно, чтобы файл считался модулем при isolatedModules
