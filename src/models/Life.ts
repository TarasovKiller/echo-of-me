// src/models/Life.ts

import {
  LifeProfile,
  LifeTraits,
  MemoryEvent,
  MoralCompass,
  AwarenessLevel,
  AdviceImpact
} from '../types/life';

export class Life {
  /** 🏷 Идентификация и стартовые контексты */
  private name: string;
  private gender: 'male' | 'female' | 'nonbinary';
  private age: number;
  private culture: LifeProfile['culture'];
  private atmosphere: string;

  /** 🧬 Врожденные черты — эмоциональные оси */
  private traits: LifeTraits;

  /** 💖 Скрытое желание: основа личности, не меняется */
  private hiddenDesire: string;

  /** 😨 Глубинный страх: влияет на избегающее поведение */
  private coreFear: string;

  /** 🧭 Моральный компас: гибкий этический фильтр */
  private moralCompass: MoralCompass;

  /** 🧠 Мировоззрение — как Жизнь объясняет реальность */
  private philosophy: string;

  /** 🪞 Самоописание — как Жизнь формулирует себя */
  private selfNarrative: string;

  /** 🧠 Осознание желания: влияет на реакцию на советы */
  private awarenessLevel: AwarenessLevel;

  /** 🔮 Вектор души: глобальное направление развития */
  private soulVector: number = 0;

  /** 🛡️ Устойчивость к страху: не даёт страху блокировать выбор */
  private fearResistance: number = 0;

  /** 🧠 Память: история советов, оставивших след */
  private memoryLog: MemoryEvent[] = [];

  constructor(profile: LifeProfile) {
    this.name = profile.name;
    this.gender = profile.gender;
    this.age = profile.age;
    this.culture = profile.culture;
    this.atmosphere = profile.atmosphere;

    this.traits = profile.coreTraits;
    this.hiddenDesire = profile.hiddenDesire;
    this.coreFear = profile.coreFear;
    this.philosophy = profile.philosophy;
    this.selfNarrative = profile.selfNarrative;
    this.awarenessLevel = profile.awarenessLevel;
    this.moralCompass = profile.moralCompass;
  }

  /**
   * 🩹 Применить влияние совета
   * Изменяет черты, сопротивление страху, душевный вектор и запоминает совет
   */
  public applyAdviceImpact(impact: AdviceImpact, adviceText: string, round: number): void {
    for (const trait in impact.emotionalEffect) {
      const key = trait as keyof LifeTraits;
      this.traits[key] += impact.emotionalEffect[key]!;
    }

    // Усилие к цели
    if (adviceText.toLowerCase().includes(this.hiddenDesire.toLowerCase())) {
      this.soulVector += 1;
    }

    // Реакция на страх
    if (adviceText.toLowerCase().includes(this.coreFear.toLowerCase())) {
      if (this.traits.trust > 60 || this.fearResistance > 30) {
        this.fearResistance += 10;
      } else {
        this.soulVector -= 1;
      }
    }

    // Память
    this.memoryLog.push({
      quote: adviceText,
      emotionalEcho: impact.resonanceScore > 50 ? 'затронуло' : 'оставило сомнение',
      effect: impact.emotionalEffect,
      round,
    });
  }

  /** 📤 Получить полный профиль */
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
      moralCompass: this.moralCompass,
    };
  }

  /** 🧠 Получить внутреннюю память */
  public getMemory(): MemoryEvent[] {
    return [...this.memoryLog];
  }

  /** 🔍 Получить значение душевного вектора */
  public getSoulVector(): number {
    return parseFloat(this.soulVector.toFixed(2));
  }

  /** 🧭 Получить моральный компас */
  public getMoralCompass(): MoralCompass {
    return this.moralCompass;
  }

  /** 🗣 Реплика от первого лица */
  public describeSelf(): string {
    return `Меня зовут ${this.name}. Я часто думаю: "${this.philosophy}". Но в глубине... я боюсь ${this.coreFear}.`;
  }

  /** ✅ Проверка — совпадает ли совет с желанием */
  public resonatesWith(text: string): boolean {
    return text.toLowerCase().includes(this.hiddenDesire.toLowerCase());
  }

  /** 🧬 JSON-сериализация */
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
      moralCompass: this.moralCompass,
      fearResistance: this.fearResistance,
    };
  }
}
