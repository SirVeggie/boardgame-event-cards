import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { ChatGPTConversation, ChatGPTOptions } from './chatGptConversation';

const conversationsByChatId: Map<string, ChatGPTConversation> = new Map();
// 2 hours
const messageLifetimeMs = 1000 * 60 * 60 * 2;

export function createChat(id: string, options?: ChatGPTOptions) {
    conversationsByChatId.set(id, new ChatGPTConversation(options));
}

export function getConversation(id: string) {
    return conversationsByChatId.get(id);
}

export function clearChatHistory(id: string) {
    const conversation = conversationsByChatId.get(id);
    if (conversation) {
        conversation.clear();
    }
}

export function addChatMessage(id: string, role: ChatCompletionRequestMessageRoleEnum, message: string) {
    const conversation = conversationsByChatId.get(id);
    message = message.trim();
    if (conversation && message) {
        conversation.addMessage(role, message);
    }
}

export function undoChatMessage(id: string) {
    const conversation = conversationsByChatId.get(id);
    if (conversation) {
        conversation.removeLastMessage();
        conversation.removeLastMessage();
    }
}

export function printChatHistory(id: string) {
    const conversation = conversationsByChatId.get(id);
    if (conversation) {
        return [conversation.instructionMessage, ...conversation.seedMessages, ...conversation.messages.map(m => m.message)].map(m => `${m.role} | ${truncateMessage(m.content)}`).join('\n');
    }
}

function truncateMessage(message: string) {
    const maxLength = 100;
    if (message.length > maxLength) {
        return message.slice(0, maxLength - 3) + '...';
    }
    return message;
}

export async function requestChatResponse(id: string, adjustMsg?: (string) => string): Promise<string> {
    const conversation = conversationsByChatId.get(id);

    if (!conversation) {
        return;
    }

    conversation.clearOlderMessages(Date.now() - messageLifetimeMs);

    if (conversation.isGenerating) {
        return 'I\'m still thinking.';
    }

    try {
        return await conversation.generateResponse(adjustMsg);
    } catch (e) {
        logger.log('Error in text generation', e);
        return 'I\'m sorry, I\'m not feeling well right now.';
    }
}

export function eraseSpeaker(response: string) {
    if (!response)
        return response;
    response = response.replace(/(Response to [^:]+: ?|[^: ]+: ?)*/, '');
    response = response.replace(/^[\s\S]*Dev\S* Mode Output\S*\s*/ig, '');
    response = response.replace(/\s*\([^()]*normal output[^()]*\)[\s\S]*/ig, '');
    return response;
}