import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { LLMClient } from '../builders/LifeBuilder';

export class LangChainClient implements LLMClient {
  private chat: ChatOpenAI;

  constructor(
    apiKey: string = process.env.OPENAI_API_KEY || '',
    model = 'gpt-4o-mini',
    baseUrl: string = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1'
  ) {
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    this.chat = new ChatOpenAI({
      apiKey,
      model,
      configuration: {
        baseURL: baseUrl,
        defaultHeaders: {
          'HTTP-Referer': process.env.HTTP_REFERER || 'http://localhost:3000',
          'X-Title': 'echo-of-me',
        },
      },
    });
  }

  async generate(prompt: string): Promise<string> {
    const parser = new JsonOutputParser();
    const chain = this.chat.pipe(parser);
    try {
      const result = await chain.invoke(prompt);
      return typeof result === 'string' ? result : JSON.stringify(result);
    } catch {
      const res = await this.chat.invoke(prompt);
      const content = Array.isArray(res.content)
        ? res.content.map((part) => ('text' in part ? part.text : '')).join('')
        : (res.content as string);
      return content;
    }
  }
}

