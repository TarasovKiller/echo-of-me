// src/models/Life.ts

import { LifeTraits, AdviceImpact, LifeProfile } from '../types/life';

export class Life {
  private name: string;
  private gender: 'male' | 'female' | 'nonbinary';
  private age: number;
  private culture: LifeProfile['culture'];
  private atmosphere: string;

  private traits: LifeTraits;
  private hiddenDesire: string;
  private soulVector: number;
  private memory: string[] = [];

  private coreFear: string;
  private philosophy: string;
  private selfNarrative: string;
  private awarenessLevel: LifeProfile['awarenessLevel'];

  constructor(profile: LifeProfile) {
    this.name = profile.name;
    this.gender = profile.gender;
    this.age = profile.age;
    this.culture = profile.culture;
    this.atmosphere = profile.atmosphere;

    this.traits = profile.coreTraits;
    this.hiddenDesire = profile.hiddenDesire;
    this.soulVector = 0;

    this.coreFear = profile.coreFear;
    this.philosophy = profile.philosophy;
    this.selfNarrative = profile.selfNarrative;
    this.awarenessLevel = profile.awarenessLevel;
  }

  // 🧠 Получить публичный профиль
  public getProfile(): LifeProfile {
    return {
      name: this.name,
      gender: this.gender,
      age: this.age,
      culture: this.culture,
      atmosphere: this.atmosphere,
      coreTraits: this.traits,
      hiddenDesire: this.hiddenDesire,
      coreFear: this.coreFear,
      philosophy: this.philosophy,
      selfNarrative: this.selfNarrative,
      awarenessLevel: this.awarenessLevel,
    };
  }

  // 🩹 Применить влияние совета
  public applyAdviceImpact(impact: AdviceImpact, adviceText: string): void {
    for (const trait in impact.emotionalEffect) {
      const key = trait as keyof LifeTraits;
      this.traits[key] += impact.emotionalEffect[key]!;
    }

    this.soulVector += impact.soulShift;
    this.memory.push(adviceText);
  }

  // 🔍 Получить значение вектора души
  public getSoulVector(): number {
    return parseFloat(this.soulVector.toFixed(2));
  }

  // 🧠 Получить воспоминания
  public getMemory(): string[] {
    return [...this.memory];
  }

  // 🗣 Внутренний голос Жизни
  public describeSelf(): string {
    return `Меня зовут ${this.name}. Я часто думаю: "${this.philosophy}". Но в глубине... я боюсь ${this.coreFear}.`;
  }

  // 🧬 JSON-сериализация
  public toJSON(): object {
    return {
      name: this.name,
      gender: this.gender,
      age: this.age,
      atmosphere: this.atmosphere,
      culture: this.culture,
      traits: this.traits,
      hiddenDesire: this.hiddenDesire,
      soulVector: this.getSoulVector(),
      memory: this.getMemory(),
      coreFear: this.coreFear,
      philosophy: this.philosophy,
      selfNarrative: this.selfNarrative,
      awarenessLevel: this.awarenessLevel,
    };
  }

  // ✅ Проверка резонанса совета (примерный API)
  public resonatesWith(text: string): boolean {
    return text.toLowerCase().includes(this.hiddenDesire.toLowerCase());
  }
}
