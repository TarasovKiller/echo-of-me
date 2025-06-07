import {
    ValueCategory,
    ValueTypeKind,
    ValueSourceKind,
    ValueSphere,
    EmotionalTone,
    ValueStability
  } from './characterValueEnums';
  
  import { ValueName } from './valueName';
  
  export interface CharacterValue {
    /** Уникальное имя ценности (семантический идентификатор) */
    name: ValueName;
  
    /** Категория по модели Шварца */
    category: ValueCategory;
  
    /** Тип/типы по Рокичу — цель/средство */
    type: ValueTypeKind[];
  
    /** Источники происхождения */
    source: ValueSourceKind[];
  
    /** Где проявляется ценность */
    sphere: ValueSphere;
  
    /** Эмоциональная окраска (мотивация) */
    emotionalTone: EmotionalTone;
  
    /** Насколько устойчива ценность */
    stability: ValueStability;
  
    /** Измеряется ли количественно */
    measurable: boolean;
  
    /** Текущий уровень ценности (0–100) */
    valueScore: number;
  }
  