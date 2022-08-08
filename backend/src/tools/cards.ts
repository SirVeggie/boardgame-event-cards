import { userError, validateCard } from 'shared';
import { CardType } from 'shared/src/types';
import { loadJson, saveJson } from './jsonFiles';

const obj = {
    cards: [] as CardType[]
};
const cardLocation = './data/cards.txt';

export function getCards(): CardType[] {
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

export async function loadCards() {
    obj.cards = await loadJson(cardLocation) ?? [];
}

export function saveCards() {
    saveJson(cardLocation, obj.cards, true);
}