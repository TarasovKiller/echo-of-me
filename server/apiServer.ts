import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { OpenAIClient } from '../src/llm/OpenAIClient';
import { DilemmaBuilder } from '../src/builders/DilemmaBuilder';
import { LifeTraits } from '../src/types/life';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/dilemma', async (req: Request, res: Response) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY not set' });
    return;
  }

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

  const llm = new OpenAIClient(apiKey);
  const builder = new DilemmaBuilder(llm);

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
