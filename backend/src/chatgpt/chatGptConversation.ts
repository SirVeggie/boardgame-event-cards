import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, ChatCompletionResponseMessage, CreateChatCompletionRequest, CreateChatCompletionResponse } from 'openai';
import { CompletionOptions, openaiApi, streamChatCompletionRequest, StreamChunkResponse } from './openAiApi';
import GPT3Tokenizer from 'gpt3-tokenizer';

const DEFAULT_MODEL = 'gpt-3.5-turbo';
const DEFAULT_INSTRUCTION = 'You are a helpful assistant.';
const DEFAULT_OPTIONS: CreateChatCompletionRequest = {
    model: DEFAULT_MODEL,
    messages: [],
};

type StreamMessageResponse = {
    message: string;
    chunks: StreamChunkResponse[];
};

type TimestampedMessage = {
    timestamp: number;
    message: ChatCompletionResponseMessage;
};

export type ChatGPTOptions = {
    instruction?: string;
    tokenLimit?: number;
    seedMessages?: ChatCompletionResponseMessage[];
    apiOptions?: CompletionOptions;
};

export class ChatGPTConversation {
    public isGenerating: boolean = false;
    public messages: TimestampedMessage[] = [];
    public lastResponse?: CreateChatCompletionResponse | StreamChunkResponse[];
    public lastTokenCount?: number;
    public requestOptions?: CompletionOptions;
    public instructionMessage: ChatCompletionResponseMessage;
    public seedMessages: ChatCompletionResponseMessage[] = [];
    public tokenLimit: number;
    public chatHistoryStorage = 1000;
    public debug = false;

    constructor(
        options?: ChatGPTOptions
    ) {
        this.requestOptions = options?.apiOptions;
        this.tokenLimit = options?.tokenLimit ?? 1500;
        this.instructionMessage = {
            role: 'system',
            content: options?.instruction ?? DEFAULT_INSTRUCTION,
        };
        this.seedMessages = options?.seedMessages ?? [];
    }

    public addMessage(role: ChatCompletionRequestMessageRoleEnum, content: string): void {
        this.messages.push({ timestamp: Date.now(), message: { role, content } });
        if (this.messages.length > this.chatHistoryStorage) {
            const amount = Math.ceil(this.chatHistoryStorage / 10);
            this.messages.splice(0, amount);
        }
    }

    public removeLastMessage(): void {
        this.messages.pop();
    }

    public clear(): void {
        this.messages = [];
        this.lastResponse = undefined;
    }

    // change the instruction
    public changeInstruction(instruction: string, seedMessages?: ChatCompletionResponseMessage[]): void {
        this.instructionMessage = {
            role: 'system',
            content: instruction,
        };
        this.seedMessages = seedMessages ?? [];
        this.clear();
    }

    // reset the instruction to the default
    public resetInstruction(): void {
        this.changeInstruction(DEFAULT_INSTRUCTION);
    }

    // clear older messages
    public clearOlderMessages(timestamp: number): void {
        this.messages = this.messages.filter((m) => m.timestamp > timestamp);
    }

    public getMessages(tokenLimit: number) {
        const messages = this.messages.map(m => m.message);
        const collection: typeof messages = [];

        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            collection.push(msg);
            if (countTokens(collection) >= tokenLimit) {
                break;
            }
        }

        return collection.reverse();
    }

    public async generateResponse(
        modifyResult?: (result: string) => string,
        onPartialMessage?: (message: string) => void
    ): Promise<string | undefined> {
        if (this.isGenerating) {
            throw new Error('Wait for an AI response first');
        }

        this.isGenerating = true;

        try {
            const chatMessages = this.getMessages(this.tokenLimit - countTokens([this.instructionMessage, ...this.seedMessages]));
            const requestMessages = [
                this.instructionMessage,
                ...this.seedMessages,
                ...chatMessages,
            ];
            const request: CreateChatCompletionRequest = {
                ...DEFAULT_OPTIONS,
                ...this.requestOptions,
                messages: requestMessages,
            };

            this.lastTokenCount = countTokens(requestMessages);

            if (this.debug) {
                console.log(JSON.stringify(chatMessages, null, 2));
                console.log(`Message token amount: ${this.lastTokenCount}`);
            }

            let message: string | undefined;
            if (onPartialMessage) {
                const streamRes = await this.streamResponse(request, onPartialMessage);
                this.lastResponse = streamRes?.chunks;
                message = streamRes?.message ?? undefined;
            } else {
                const res = await openaiApi.createChatCompletion(request, {
                    timeout: 120000,
                });
                this.lastResponse = res.data;
                message = this.lastResponse.choices[0].message?.content ?? undefined;
            }

            if (message) {
                this.addMessage(ChatCompletionRequestMessageRoleEnum.Assistant, modifyResult?.(message) ?? message);
            }

            return message;
        } catch (e) {
            return undefined;
        } finally {
            this.isGenerating = false;
        }
    }

    private async streamResponse(req: CreateChatCompletionRequest, onPartialMessage: (m: string) => void): Promise<StreamMessageResponse | undefined> {
        return new Promise((resolve) => {

            let partialMessage = '';
            const chunks: StreamChunkResponse[] = [];

            streamChatCompletionRequest(req, (data) => {
                chunks.push(data);
                partialMessage += data.choices[0].delta.content ?? '';
                if (partialMessage.length > 0) {
                    onPartialMessage(partialMessage);
                }
            }, () => {
                console.log('end');
                resolve({
                    message: partialMessage,
                    chunks
                });
            }, (e) => {
                console.log(e);
                resolve(undefined);
            });
        });
    }
}

function countTokens(messages: ChatCompletionRequestMessage[]): number {
    const counter = new GPT3Tokenizer({ type: 'gpt3' });
    return messages.reduce((acc, m) => acc + counter.encode(m.content).bpe.length, 0);
}