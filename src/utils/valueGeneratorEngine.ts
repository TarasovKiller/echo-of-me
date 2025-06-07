import { CharacterValue } from '../types/characterValue';
import {
  ValueName
} from '../types/valueName';
import {
  ValueCategory,
  ValueTypeKind,
  ValueSourceKind,
  ValueSphere,
  EmotionalTone,
  ValueStability
} from '../types/characterValueEnums';
import { randomItem, randomBool, randomInt } from './randomUtils';

/**
 * 🔧 Генерация полной структуры CharacterValue на основе имени.
 * Использует логические правила, чтобы заполнить все поля.
 */
export function generateCharacterValue(): CharacterValue {
  const name = randomItem(Object.values(ValueName));

  const type = inferType(name);
  const source = inferSource(name);
  const category = inferCategory(name);
  const sphere = inferSphere(name);
  const emotionalTone = inferTone(name, category);
  const stability = inferStability(source);
  const measurable = inferMeasurability(sphere);
  const valueScore = generateValueScore();

  return {
    name,
    type,
    source,
    category,
    sphere,
    emotionalTone,
    stability,
    measurable,
    valueScore
  };
}

// ——————————— INFERENCING METHODS ———————————

/**
 * 🎯 Определяет тип ценности: terminal/instrumental.
 * 💡 Идея: если ценность — цель жизни (freedom), → terminal;
 * если стратегия поведения (honesty), → instrumental.
 */
function inferType(name: ValueName): ValueTypeKind[] {
  const terminalNames: ValueName[] = [
    ValueName.Freedom, ValueName.Honor, ValueName.Justice,
    ValueName.Independence, ValueName.Equality
  ];
  const instrumentalNames: ValueName[] = [
    ValueName.Honesty, ValueName.Responsibility, ValueName.Obedience,
    ValueName.Tolerance
  ];

  if (terminalNames.includes(name)) return [ValueTypeKind.Terminal];
  if (instrumentalNames.includes(name)) return [ValueTypeKind.Instrumental];

  return randomBool()
    ? [ValueTypeKind.Terminal]
    : [ValueTypeKind.Terminal, ValueTypeKind.Instrumental];
}

/**
 * 🧬 Определяет источник ценности: откуда она берётся.
 * 💡 Идея:
 * - biological: врождённые стремления (curiosity);
 * - social: навязано обществом (obedience);
 * - experience: результат событий (honesty, compassion).
 */
function inferSource(name: ValueName): ValueSourceKind[] {
  if ([ValueName.Curiosity, ValueName.Independence].includes(name)) return [ValueSourceKind.Biological];
  if ([ValueName.Obedience, ValueName.Tradition, ValueName.Responsibility].includes(name)) return [ValueSourceKind.Social];
  if ([ValueName.Honesty, ValueName.Compassion, ValueName.Wisdom].includes(name)) return [ValueSourceKind.Experience, ValueSourceKind.Social];

  return [randomItem([
    ValueSourceKind.Biological,
    ValueSourceKind.Social,
    ValueSourceKind.Experience
  ])];
}

/**
 * 🧭 Присваивает категорию по Шварцу на основе имени.
 * 💡 Идея: семантически близкие ценности → одна категория.
 */
function inferCategory(name: ValueName): ValueCategory {
  const map: Partial<Record<ValueName, ValueCategory>> = {
    [ValueName.Honesty]: ValueCategory.Conformity,
    [ValueName.Freedom]: ValueCategory.SelfDirection,
    [ValueName.Power]: ValueCategory.Power,
    [ValueName.Compassion]: ValueCategory.Benevolence,
    [ValueName.Justice]: ValueCategory.Universalism,
    [ValueName.Obedience]: ValueCategory.Tradition,
    [ValueName.Tolerance]: ValueCategory.Universalism,
    [ValueName.Achievement]: ValueCategory.Achievement,
    [ValueName.Loyalty]: ValueCategory.Benevolence,
    [ValueName.SelfExpression]: ValueCategory.SelfDirection,
    [ValueName.Responsibility]: ValueCategory.Conformity,
    [ValueName.Mercy]: ValueCategory.Benevolence,
    [ValueName.Equality]: ValueCategory.Universalism,
    [ValueName.Friendship]: ValueCategory.Benevolence,
    [ValueName.Leadership]: ValueCategory.Power,
    [ValueName.Order]: ValueCategory.Security,
    [ValueName.Faithfulness]: ValueCategory.Tradition,
    [ValueName.Wisdom]: ValueCategory.SelfDirection,
    [ValueName.Security]: ValueCategory.Security,
    [ValueName.Tradition]: ValueCategory.Tradition,
    [ValueName.Ambition]: ValueCategory.Achievement,
    [ValueName.Prestige]: ValueCategory.Power,
    [ValueName.Honor]: ValueCategory.Conformity,
    [ValueName.Harmony]: ValueCategory.Universalism,
    [ValueName.Curiosity]: ValueCategory.Stimulation,
    [ValueName.Pleasure]: ValueCategory.Hedonism,
    [ValueName.Humility]: ValueCategory.Tradition,
    [ValueName.Independence]: ValueCategory.SelfDirection
  };

  return map[name] ?? ValueCategory.Universalism;
}

/**
 * 🕸 Определяет, где ценность проявляется: личное, социальное и т.п.
 * 💡 Идея: разные ценности имеют разный радиус действия.
 */
function inferSphere(name: ValueName): ValueSphere {
  if ([ValueName.Honesty, ValueName.Freedom, ValueName.Wisdom, ValueName.Independence].includes(name))
    return ValueSphere.Personal;
  if ([ValueName.Compassion, ValueName.Friendship, ValueName.Mercy, ValueName.Tolerance].includes(name))
    return ValueSphere.Interpersonal;
  if ([ValueName.Obedience, ValueName.Justice, ValueName.Tradition, ValueName.Order].includes(name))
    return ValueSphere.Societal;

  return randomItem([
    ValueSphere.Personal,
    ValueSphere.Interpersonal,
    ValueSphere.Societal
  ]);
}

/**
 * ❤️ Определяет эмоциональную мотивацию ценности.
 * 💡 Идея: каждое стремление может быть вызвано страхом, интересом, эмпатией и т.п.
 */
function inferTone(name: ValueName, category: ValueCategory): EmotionalTone {
  if ([ValueName.Security, ValueName.Order, ValueName.Obedience].includes(name))
    return EmotionalTone.AnxietyBased;
  if ([ValueName.Freedom, ValueName.Curiosity, ValueName.Wisdom, ValueName.SelfExpression].includes(name))
    return EmotionalTone.GrowthOriented;
  if ([ValueName.Compassion, ValueName.Mercy, ValueName.Friendship].includes(name))
    return EmotionalTone.Altruistic;
  if ([ValueName.Pleasure].includes(name))
    return EmotionalTone.Hedonistic;

  return randomItem([
    EmotionalTone.GrowthOriented,
    EmotionalTone.AnxietyBased,
    EmotionalTone.Altruistic
  ]);
}

/**
 * 🧱 Определяет устойчивость ценности к изменениям.
 * 💡 Идея: биологические и травматические ценности чаще стабильнее.
 */
function inferStability(source: ValueSourceKind[]): ValueStability {
  if (source.includes(ValueSourceKind.Biological)) return ValueStability.High;
  if (source.includes(ValueSourceKind.Experience)) return ValueStability.Medium;
  return ValueStability.Low;
}

/**
 * 📏 Проверяет, можно ли измерить ценность в поведении.
 * 💡 Идея: личные ценности труднее визуализировать, чем социальные.
 */
function inferMeasurability(sphere: ValueSphere): boolean {
  return sphere !== ValueSphere.Personal;
}

/**
 * 🎚 Генерирует базовое значение выраженности ценности (0–100).
 * 💡 Идея: стартовая сила может быть средне-выраженной.
 */
function generateValueScore(): number {
  return randomInt(40, 80);
}
