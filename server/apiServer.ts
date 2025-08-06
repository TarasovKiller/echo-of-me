import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { LangChainFactory } from '../src/llm/LangChainFactory';
import { generateLifeBase } from '../src/utils/lifeGeneration';
import { LifeProfile, LifeTraits } from '../src/types/life';
import { Dilemma } from '../src/types/dilemma';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Инициализация LangChain фабрики
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('❌ OPENAI_API_KEY не найден в .env');
  process.exit(1);
}

const langChainFactory = LangChainFactory.getInstance(apiKey);

// 🧬 Генерация личности Life
app.post('/api/generate-life', async (req: Request, res: Response) => {
  try {
    const base = generateLifeBase();
    const lifeChain = langChainFactory.getLifeGenerationChain();
    const lifeProfile = await lifeChain.generateLife(base);
    
    console.log('✅ Life сгенерирован:', lifeProfile.name);
    res.json(lifeProfile);
  } catch (error) {
    console.error('❌ Ошибка генерации Life:', error);
    res.status(500).json({ error: 'Ошибка генерации личности' });
  }
});

// 🎯 Генерация дилеммы
app.post('/api/generate-dilemma', async (req: Request, res: Response) => {
  try {
    const { lifeProfile, countryContext, settlementContext, familyContext, socialContext } = req.body;
    
    if (!lifeProfile) {
      return res.status(400).json({ error: 'lifeProfile обязателен' });
    }

    const dilemmaChain = langChainFactory.getDilemmaGenerationChain();
    const dilemma = await dilemmaChain.generateDilemma(
      lifeProfile,
      countryContext || 'Современная Россия',
      settlementContext || 'Средний город',
      familyContext || 'Полная семья, средний достаток',
      socialContext || 'Школьные друзья, учителя'
    );
    
    console.log('✅ Дилемма сгенерирована');
    res.json(dilemma);
  } catch (error) {
    console.error('❌ Ошибка генерации дилеммы:', error);
    res.status(500).json({ error: 'Ошибка генерации дилеммы' });
  }
});

// 🧠 Анализ влияния совета
app.post('/api/analyze-advice', async (req: Request, res: Response) => {
  try {
    const { advice, lifeProfile, situation, question, dilemmaContext } = req.body;
    
    if (!advice || !lifeProfile) {
      return res.status(400).json({ error: 'advice и lifeProfile обязательны' });
    }

    const adviceChain = langChainFactory.getAdviceAnalysisChain();
    const analysis = await adviceChain.analyzeSingleAdvice(
      advice,
      lifeProfile,
      situation || 'Сложная жизненная ситуация',
      question || 'Что мне делать?',
      dilemmaContext || 'Нужно принять важное решение'
    );
    
    console.log('✅ Анализ совета завершён');
    res.json(analysis);
  } catch (error) {
    console.error('❌ Ошибка анализа совета:', error);
    res.status(500).json({ error: 'Ошибка анализа совета' });
  }
});

// 🎯 Сравнение и выбор лучшего совета
app.post('/api/compare-advices', async (req: Request, res: Response) => {
  try {
    const { advices, lifeProfile, situation, question, dilemmaContext } = req.body;
    
    if (!advices || !Array.isArray(advices) || !lifeProfile) {
      return res.status(400).json({ error: 'advices (массив) и lifeProfile обязательны' });
    }

    const adviceChain = langChainFactory.getAdviceAnalysisChain();
    const comparison = await adviceChain.compareAndChooseAdvice(
      advices,
      lifeProfile,
      situation || 'Сложная жизненная ситуация',
      question || 'Что мне делать?',
      dilemmaContext || 'Нужно принять важное решение'
    );
    
    console.log('✅ Сравнение советов завершено');
    res.json(comparison);
  } catch (error) {
    console.error('❌ Ошибка сравнения советов:', error);
    res.status(500).json({ error: 'Ошибка сравнения советов' });
  }
});

// 🔄 Пакетный анализ всех советов
app.post('/api/analyze-all-advices', async (req: Request, res: Response) => {
  try {
    const { advices, lifeProfile, situation, question, dilemmaContext } = req.body;
    
    if (!advices || !Array.isArray(advices) || !lifeProfile) {
      return res.status(400).json({ error: 'advices (массив) и lifeProfile обязательны' });
    }

    const adviceChain = langChainFactory.getAdviceAnalysisChain();
    const analyses = await adviceChain.analyzeAllAdvices(
      advices,
      lifeProfile,
      situation || 'Сложная жизненная ситуация',
      question || 'Что мне делать?',
      dilemmaContext || 'Нужно принять важное решение'
    );
    
    console.log('✅ Пакетный анализ завершён');
    res.json(analyses);
  } catch (error) {
    console.error('❌ Ошибка пакетного анализа:', error);
    res.status(500).json({ error: 'Ошибка пакетного анализа' });
  }
});

// 🏥 Проверка здоровья сервера
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    langChain: 'initialized'
  });
});

// 🚀 Запуск сервера
app.listen(port, () => {
  console.log(`🚀 API сервер запущен на порту ${port}`);
  console.log(`📡 LangChain фабрика инициализирована`);
  console.log(`🧬 Доступные эндпоинты:`);
  console.log(`   POST /api/generate-life`);
  console.log(`   POST /api/generate-dilemma`);
  console.log(`   POST /api/analyze-advice`);
  console.log(`   POST /api/compare-advices`);
  console.log(`   POST /api/analyze-all-advices`);
  console.log(`   GET  /api/health`);
});
