import axios from 'axios';
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, ChatCompletionResponseMessage, Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CHAT_GPT_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-3.5-turbo';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openaiApi = new OpenAIApi(configuration);

export interface StreamChunkResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: StreamChoice[];
}

interface StreamChoice {
  delta: StreamDelta;
  index: number;
  finish_reason: any;
}

interface StreamDelta {
  content?: string;
}

export type CompletionOptions = Omit<CreateChatCompletionRequest, 'model' | 'stream' | 'messages'>;

export function createMessage(role: ChatCompletionRequestMessageRoleEnum, content: string): ChatCompletionResponseMessage {
  return {
    role,
    content
  };
}

export async function singleCompletion(instruction: string | ChatCompletionRequestMessage[], message: string, options?: CompletionOptions) {
  if (typeof instruction === 'string') {
    instruction = [createMessage('system', instruction)];
  }

  const request: CreateChatCompletionRequest = {
    ...options,
    model: DEFAULT_MODEL,
    messages: [...instruction, createMessage('user', message)],

  };

  const res = await openaiApi.createChatCompletion(request, {
    timeout: 120000,
  });

  return res.data.choices[0].message?.content ?? undefined;
}

export const streamChatCompletionRequest = async (
  req: CreateChatCompletionRequest,
  handleData: (data: StreamChunkResponse) => void,
  onDataEnd: () => void,
  onError: (e: any) => void) => {
  try {
    console.log('Sending request:', req);
    const response = await axios.post(CHAT_GPT_URL, { ...req, stream: true }, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
      timeout: 120000,
    });

    response.data.on('data', (messageChunk: Buffer) => {
      console.log('v--------------------------------------------------------');
      console.log(messageChunk.toString());
      console.log('^--------------------------------------------------------');

      const lines = messageChunk.toString().split(/\r?\n/);
      lines.forEach(line => {
        console.log('line:', line);
        if (!line.length) {
          return;
        }

        try {
          // prefix of length 6 "data: "
          const json = line.toString().trim().substring(6);
          if (json === '[DONE]') {
            return;
          }

          const data = JSON.parse(json) as StreamChunkResponse;
          if (data) {
            handleData(data);
          }
        } catch (e) {
          console.log('Error parsing chunk: \'', e);
        }
      });
    });

    response.data.on('end', () => {
      onDataEnd();
    });

    response.data.on('error', (err: Error) => {
      onError(err);
    });
  } catch (error: any) {
    if (error.response) {
      console.error(`API responded with status ${error.response.status}:`, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};
