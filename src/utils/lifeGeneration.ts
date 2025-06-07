// utils/lifeGeneration.ts

export type LifeBase = {
    gender: "male" | "female";
    age: number;
    atmosphere:
      | "tender"
      | "chaotic"
      | "cold"
      | "neutral"
      | "melancholic"
      | "oppressive"
      | "inspiring"
      | "eerie"
      | "vibrant"
      | "dramatic";
  };
  
  const randomChoice = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];
  
  export function generateLifeBase(): LifeBase {
    return {
      gender: randomChoice(["male", "female"]),
      age: Math.floor(Math.random() * (14 - 8 + 1)) + 8,
      atmosphere: randomChoice([
        "tender",
        "chaotic",
        "cold",
        "neutral",
        "melancholic",
        "oppressive",
        "inspiring",
        "eerie",
        "vibrant",
        "dramatic",
      ]),
    };
  }
  
  export function escapeForJinja(text: string): string {
    return text.replace(/{/g, "{{ '{' }}").replace(/}/g, "{{ '}' }}");
  }
  