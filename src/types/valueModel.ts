// 💠 Универсальные категории по Шварцу
export type ValueCategory =
  // 🔹 Самостоятельность: свобода, креативность, независимость
  | 'Self-Direction'
  // 🔹 Стимуляция: поиск новизны, риска, возбуждения
  | 'Stimulation'
  // 🔹 Гедонизм: удовольствие, наслаждение
  | 'Hedonism'
  // 🔹 Достижение: успех, компетентность, признание
  | 'Achievement'
  // 🔹 Власть: статус, контроль, доминирование
  | 'Power'
  // 🔹 Безопасность: стабильность, защита, порядок
  | 'Security'
  // 🔹 Конформность: следование правилам, избежание неодобрения
  | 'Conformity'
  // 🔹 Традиция: уважение к обычаям, религии, культуре
  | 'Tradition'
  // 🔹 Доброжелательность: забота о ближних, альтруизм
  | 'Benevolence'
  // 🔹 Универсализм: толерантность, защита природы и человечества
  | 'Universalism';

// 💠 Типы по Рокичу (можно выбрать оба)
export type ValueTypeKind =
  // 🔹 Терминальные: цели жизни (например, свобода, любовь)
  | 'terminal'
  // 🔹 Инструментальные: способы достижения (например, честность, упорство)
  | 'instrumental';

// 💠 Источники происхождения ценности
export type ValueSourceKind =
  // 🔹 Биологический: темперамент, нейрофизиология, врождённые реакции
  | 'biological'
  // 🔹 Социальный: семья, культура, воспитание
  | 'social'
  // 🔹 Личный опыт: травмы, события, откровения
  | 'experience';

// 💠 Где проявляется ценность
export type ValueSphere =
  // 🔹 Внутренние решения, цели, самооценка
  | 'personal'
  // 🔹 Отношения с другими (друзья, семья, любовь)
  | 'interpersonal'
  // 🔹 Социальные роли, нормы, идеология
  | 'societal';

// 💠 Эмоциональная мотивация
export type EmotionalTone =
  // 🔹 Рост и вдохновение: интерес, тяга к развитию
  | 'growth_oriented'
  // 🔹 Защита и страх: тревога, избегание боли
  | 'anxiety_based'
  // 🔹 Альтруизм и эмпатия: забота, сочувствие
  | 'altruistic'
  // 🔹 Удовольствие и наслаждение
  | 'hedonistic';

// 💠 Устойчивость ценности ко времени/влиянию
export type ValueStability =
  // 🔹 Низкая: легко меняется, зависит от окружения
  | 'low'
  // 🔹 Средняя: может быть скорректирована событиями
  | 'medium'
  // 🔹 Высокая: формирует ядро личности, почти неизменна
  | 'high';

  export type ValueName =
  | 'honesty'
  | 'freedom'
  | 'power'
  | 'compassion'
  | 'justice'
  | 'obedience'
  | 'tolerance'
  | 'achievement'
  | 'loyalty'
  | 'self_expression'
  | 'responsibility'
  | 'mercy'
  | 'equality'
  | 'friendship'
  | 'leadership'
  | 'order'
  | 'faithfulness'
  | 'wisdom'
  | 'security'
  | 'tradition'
  | 'ambition'
  | 'prestige'
  | 'honor'
  | 'harmony'
  | 'curiosity'
  | 'pleasure'
  | 'humility'
  | 'independence';

  export const ValueNameLabelMap: Record<ValueName, string> = {
    honesty: 'Честность',
    freedom: 'Свобода',
    power: 'Сила',
    compassion: 'Сострадание',
    justice: 'Справедливость',
    obedience: 'Послушание',
    tolerance: 'Терпимость',
    achievement: 'Достижение',
    loyalty: 'Преданность',
    self_expression: 'Самовыражение',
    responsibility: 'Ответственность',
    mercy: 'Милосердие',
    equality: 'Равенство',
    friendship: 'Дружба',
    leadership: 'Лидерство',
    order: 'Порядок',
    faithfulness: 'Верность',
    wisdom: 'Мудрость',
    security: 'Безопасность',
    tradition: 'Традиции',
    ambition: 'Амбиции',
    prestige: 'Престиж',
    honor: 'Честь',
    harmony: 'Гармония',
    curiosity: 'Любознательность',
    pleasure: 'Удовольствие',
    humility: 'Смирение',
    independence: 'Независимость'
  };

  

// 💠 Главный интерфейс ценности персонажа
export interface CharacterValue {

  /** Уникальное имя ценности (семантический идентификатор) */
  name: ValueName;

  /**
   * Категория по модели Шварца (10 универсальных)
   */
  category: ValueCategory;

  /**
   * Тип/типы по Рокичу — ценность может быть целью, средством или сразу обоими
   */
  type: ValueTypeKind[]; // Примеры: ['terminal'], ['instrumental'], ['terminal', 'instrumental']

  /**
   * Источники формирования: можно указать 1 или несколько
   */
  source: ValueSourceKind[]; // Примеры: ['social'], ['biological', 'experience']

  /**
   * Где проявляется ценность в жизни персонажа
   */
  sphere: ValueSphere; // Примеры: 'personal', 'interpersonal', 'societal'

  /**
   * Эмоциональная мотивация ценности
   */
  emotionalTone: EmotionalTone; // Примеры: 'growth_oriented', 'anxiety_based'

  /**
   * Насколько устойчива ценность — влияет на изменчивость
   */
  stability: ValueStability; // Примеры: 'low', 'medium', 'high'

  /**
   * Можно ли отследить ценность количественно в геймплее
   */
  measurable: boolean;

  /**
   * Текущий уровень ценности (0–100)
   */
  valueScore: number;
}
