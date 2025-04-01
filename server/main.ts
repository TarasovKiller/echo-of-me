const dotenv = require('dotenv');
dotenv.config();

const { OpenAIClient } = require('./OpenAIClient');
const { LifeBuilder } = require('./LifeBuilder');

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  const llm = new OpenAIClient(apiKey);
  const builder = new LifeBuilder(llm);

  const life = await builder.createLife();
  console.log(life.describeSelf());
}

main();
