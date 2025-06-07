const dotenv = require('dotenv');
dotenv.config();

const { OpenAIClient } = require('./OpenAIClient');
const { LifeBuilder } = require('./LifeBuilder');
const { generateLifeBase } = require('../src/utils/lifeGeneration');

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  const llm = new OpenAIClient(apiKey);
  const builder = new LifeBuilder(llm);
  const base = generateLifeBase();
  const life = await builder.createLife(base);
  console.log(life.describeSelf());
}

main();