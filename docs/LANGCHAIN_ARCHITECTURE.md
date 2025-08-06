# 🚀 LangChain Архитектура в Echo of Me

## 📋 Обзор

Проект переведён на использование **LangChain** для более эффективной и структурированной работы с LLM. Это обеспечивает:

- 🎯 **Модульность** — каждая задача решается отдельной цепочкой
- 🔄 **Переиспользование** — промпты и логика легко комбинируются
- 📊 **Мониторинг** — встроенное логирование и отладка
- 🚀 **Производительность** — оптимизированные цепочки выполнения

## 🏗️ Архитектура

### 📁 Структура файлов

```
src/llm/
├── LangChainFactory.ts          # 🏭 Фабрика для управления цепочками
├── LangChainClient.ts           # 🔌 Базовый клиент (legacy)
└── chains/                      # 🔗 Цепочки LangChain
    ├── LifeGenerationChain.ts   # 🧬 Генерация личности
    ├── AdviceAnalysisChain.ts   # 🧠 Анализ советов
    └── DilemmaGenerationChain.ts # 🎯 Генерация дилемм
```

### 🔗 Основные цепочки

#### 1. **LifeGenerationChain** — Генерация личности
```typescript
// Создание полной личности через 3 этапа
const lifeChain = langChainFactory.getLifeGenerationChain();
const lifeProfile = await lifeChain.generateLife(base);
```

**Этапы:**
- 🎯 **Шаг 1**: Генерация ценностей и имени
- 🧬 **Шаг 2**: Генерация черт характера
- 🧠 **Шаг 3**: Генерация философии и культуры

#### 2. **AdviceAnalysisChain** — Анализ советов
```typescript
// Анализ влияния одного совета
const adviceChain = langChainFactory.getAdviceAnalysisChain();
const analysis = await adviceChain.analyzeSingleAdvice(
  advice, lifeProfile, situation, question, dilemmaContext
);

// Сравнение нескольких советов
const comparison = await adviceChain.compareAndChooseAdvice(
  advices, lifeProfile, situation, question, dilemmaContext
);
```

**Возможности:**
- 🧠 Глубокий анализ эмоционального влияния
- 🎯 Сравнение и выбор лучшего совета
- 📚 Формирование памяти и ассоциаций
- 🔄 Пакетный анализ всех советов

#### 3. **DilemmaGenerationChain** — Генерация дилемм
```typescript
// Создание дилеммы с полным контекстом
const dilemmaChain = langChainFactory.getDilemmaGenerationChain();
const dilemma = await dilemmaChain.generateDilemma(
  lifeProfile, countryContext, settlementContext, familyContext, socialContext
);
```

**Особенности:**
- 🎯 Реалистичные дилеммы для конкретного возраста
- 📍 Контекстная привязка к окружению
- 🧠 Учёт психологического профиля
- 📊 Детальный анализ последствий

## 🏭 LangChainFactory

Центральная фабрика для управления всеми цепочками:

```typescript
// Инициализация (Singleton)
const langChainFactory = LangChainFactory.getInstance(apiKey, model);

// Получение цепочек
const lifeChain = langChainFactory.getLifeGenerationChain();
const adviceChain = langChainFactory.getAdviceAnalysisChain();
const dilemmaChain = langChainFactory.getDilemmaGenerationChain();
```

## 🌐 API Endpoints

### 🧬 Генерация личности
```http
POST /api/generate-life
```

### 🎯 Генерация дилеммы
```http
POST /api/generate-dilemma
Content-Type: application/json

{
  "lifeProfile": LifeProfile,
  "countryContext": "string",
  "settlementContext": "string", 
  "familyContext": "string",
  "socialContext": "string"
}
```

### 🧠 Анализ совета
```http
POST /api/analyze-advice
Content-Type: application/json

{
  "advice": "string",
  "lifeProfile": LifeProfile,
  "situation": "string",
  "question": "string",
  "dilemmaContext": "string"
}
```

### 🎯 Сравнение советов
```http
POST /api/compare-advices
Content-Type: application/json

{
  "advices": ["string"],
  "lifeProfile": LifeProfile,
  "situation": "string",
  "question": "string", 
  "dilemmaContext": "string"
}
```

### 🔄 Пакетный анализ
```http
POST /api/analyze-all-advices
Content-Type: application/json

{
  "advices": ["string"],
  "lifeProfile": LifeProfile,
  "situation": "string",
  "question": "string",
  "dilemmaContext": "string"
}
```

## 🔧 Использование в клиенте

### Импорт сервиса
```typescript
import { apiService } from '../services/apiService';
```

### Генерация Life
```typescript
const lifeProfile = await apiService.generateLife();
```

### Генерация дилеммы
```typescript
const dilemma = await apiService.generateDilemma(
  lifeProfile,
  'Современная Россия',
  'Средний город',
  'Полная семья, средний достаток',
  'Школьные друзья, учителя'
);
```

### Анализ совета
```typescript
const analysis = await apiService.analyzeAdvice(
  'Будь смелее!',
  lifeProfile,
  'Сложная ситуация',
  'Что мне делать?',
  'Нужно принять важное решение'
);
```

## 🚀 Преимущества LangChain

### 1. **Структурированность**
- Чёткое разделение ответственности
- Типизированные промпты
- Валидация входных/выходных данных

### 2. **Переиспользование**
- Промпты можно комбинировать
- Цепочки легко расширять
- Общие компоненты для разных задач

### 3. **Отладка**
- Встроенное логирование
- Трассировка выполнения
- Обработка ошибок

### 4. **Производительность**
- Кэширование промптов
- Оптимизированные цепочки
- Параллельное выполнение

## 🔄 Миграция с Legacy

### Старый код:
```typescript
const llm = new LangChainClient(apiKey);
const builder = new LifeBuilder(llm);
const life = await builder.createLife(base);
```

### Новый код:
```typescript
const langChainFactory = LangChainFactory.getInstance(apiKey);
const lifeChain = langChainFactory.getLifeGenerationChain();
const lifeProfile = await lifeChain.generateLife(base);
```

## 📊 Мониторинг

### Логирование
```typescript
console.log('✅ Шаг 1 завершён:', step1Result.name);
console.log('✅ Шаг 2 завершён:', step2Result.hiddenDesire);
console.log('✅ Шаг 3 завершён:', step3Result.philosophy);
```

### Проверка здоровья
```http
GET /api/health
```

Ответ:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "langChain": "initialized"
}
```

## 🎯 Следующие шаги

1. **Интеграция с фронтендом** — обновление компонентов
2. **Кэширование** — добавление Redis для промптов
3. **Метрики** — сбор статистики использования
4. **A/B тестирование** — сравнение разных промптов
5. **Масштабирование** — поддержка множественных моделей

---

© Echo of Me: AI-driven Narrative System с LangChain 