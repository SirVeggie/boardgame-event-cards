import { userError, validateCard, CardType } from 'shared';
import { loadJson, saveJson } from './jsonFiles';
import { singleCompletion } from '../chatgpt/openAiApi';
import { selectRandom } from './utils';

const obj = {
    cards: [] as CardType[]
};
const cardLocation = './data/cards.txt';

export function getCards(game?: string): CardType[] {
    if (game)
        return obj.cards.filter(x => x.game === game);
    return obj.cards;
}

export function addCard(card: CardType): CardType {
    if (obj.cards.some(x => x.title === card.title))
        throw userError('Card already exists');
    const res = validateCard(card);
    obj.cards.push(res);
    return res;
}

export function removeCard(title: string): void {
    const index = obj.cards.findIndex(x => x.title === title);
    if (index === -1)
        throw userError('Card not found');
    obj.cards.splice(index, 1);
}

export function updateCard(card: CardType): CardType {
    const index = obj.cards.findIndex(x => x.title === card.title);
    if (index === -1)
        throw userError('Card not found');
    const res = validateCard(card);
    obj.cards[index] = res;
    return res;
}

const cardInstruction = 'You are a content generation AI. Generate JSON data for an event card for a board game.'
    + ' Any text outside of the JSON will break the card. The JSON must be valid.';
const cardMessage = 'Please generate a new event card using these examples as a guide:';

export async function generateCard(game: string, instruction?: string): Promise<CardType | undefined> {
    const cards = selectRandom(getCards(game), 10).map(x => JSON.stringify(x)).join('\n');
    const cardJson = await singleCompletion(cardInstruction, `${instruction ?? cardMessage}\n${cards}`);
    if (!cardJson)
        throw userError('Card generation failed');
    try {
        const card = JSON.parse(cardJson) as CardType;
        card.game = game;
        return card;
    } catch {
        return undefined;
    }
}

export async function loadCards() {
    obj.cards = await loadJson(cardLocation) ?? [];
}

export function saveCards() {
    saveJson(cardLocation, obj.cards, true);
}