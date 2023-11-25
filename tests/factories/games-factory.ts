import { faker } from '@faker-js/faker';

export function generateGameName(gameName?: string) {
  return gameName || faker.commerce.productName();
}

export function generateGame(gameName?: string) {
  return {
    id: faker.number.int(),
    name: generateGameName(gameName),
  };
}
