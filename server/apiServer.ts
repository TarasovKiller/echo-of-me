import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { LangChainClient } from '../src/llm/LangChainClient';
import { DilemmaBuilder } from '../src/builders/DilemmaBuilder';
import { LifeBuilder } from '../src/builders/LifeBuilder';
import { generateLifeBase } from '../src/utils/lifeGeneration';
import { LifeProfile, LifeTraits } from '../src/types/life';
import { Dilemma } from '../src/types/dilemma';
import { adviceReactionTemplate } from '../src/prompts/actions';

dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OPENAI_API_KEY not set');
  process.exit(1);
}

const llm = new LangChainClient(apiKey);
const builder = new DilemmaBuilder(llm);
const lifeBuilder = new LifeBuilder(llm);
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/api/life', async (_req: Request, res: Response) => {
  try {
    const base = generateLifeBase();
    const life = await lifeBuilder.createLife(base);
    res.json(life.getProfile());
  } catch (err: any) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/dilemma', async (req: Request, res: Response) => {

  const {
    name = 'Аня',
    age = 15,
    traits,
    countryContext = '',
    settlementContext = '',
    familyContext = '',
    socialContext = '',
  } = req.body;

  if (!traits) {
    res.status(400).json({ error: 'Missing traits' });
    return;
  }


  try {
    const dilemma = await builder.createDilemma({
      name,
      age,
      lifeContext: JSON.stringify(traits as LifeTraits),
      countryContext,
      settlementContext,
      familyContext,
      socialContext,
    });
    res.json(dilemma);
  } catch (err: any) {
    res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
