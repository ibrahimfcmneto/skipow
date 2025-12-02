import { v4 as uuidv4 } from 'uuid';
import { Token, TokenStatus, Product } from '@/types';

import cervejaImg from '@/assets/cerveja.png';
import aguaImg from '@/assets/agua.png';
import refrigeranteImg from '@/assets/refrigerante.png';
import sucoImg from '@/assets/suco.png';

const TOKENS_KEY = 'fichas_tokens';

export const products: Product[] = [
  { id: '1', name: 'Cerveja Pilsen', price: 12.00, image: cervejaImg },
  { id: '2', name: 'Água Mineral', price: 5.00, image: aguaImg },
  { id: '3', name: 'Refrigerante', price: 8.00, image: refrigeranteImg },
  { id: '4', name: 'Suco Natural', price: 10.00, image: sucoImg },
];

export function getTokens(): Token[] {
  const stored = localStorage.getItem(TOKENS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveTokens(tokens: Token[]): void {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export function generateTokens(product: Product, quantity: number): Token[] {
  const existingTokens = getTokens();
  const newTokens: Token[] = [];

  for (let i = 0; i < quantity; i++) {
    newTokens.push({
      id: uuidv4(),
      status: 'DISPONIVEL',
      productName: product.name,
      productImage: product.image,
      createdAt: Date.now(),
    });
  }

  saveTokens([...existingTokens, ...newTokens]);
  return newTokens;
}

export function getAvailableTokens(): Token[] {
  return getTokens().filter(t => t.status === 'DISPONIVEL');
}

export function validateToken(tokenId: string): { success: boolean; token?: Token; error?: 'CONSUMED' | 'NOT_FOUND' } {
  const tokens = getTokens();
  const tokenIndex = tokens.findIndex(t => t.id === tokenId);

  if (tokenIndex === -1) {
    return { success: false, error: 'NOT_FOUND' };
  }

  const token = tokens[tokenIndex];

  if (token.status === 'CONSUMIDO') {
    return { success: false, error: 'CONSUMED', token };
  }

  // Update status to CONSUMED
  tokens[tokenIndex] = { ...token, status: 'CONSUMIDO' };
  saveTokens(tokens);

  return { success: true, token: tokens[tokenIndex] };
}

export function getTokenById(tokenId: string): Token | undefined {
  return getTokens().find(t => t.id === tokenId);
}
