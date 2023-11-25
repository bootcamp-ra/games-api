import { conflictError } from '@/errors/conflict-error';
import { notFoundError } from '@/errors/not-found-error';
import { gamesRepository } from '@/repositories/games-repository';

async function getGames() {
  const games = await gamesRepository.getGames();
  return games;
}

async function getGameById(gameId: number) {
  const game = await gamesRepository.getGameById(gameId);

  if (!game) throw notFoundError('Game');
  return game;
}

async function createGame(gameName: string) {
  const doesGameExist = await gamesRepository.getGameByName(gameName);
  if (doesGameExist) throw conflictError('Game');

  const game = await gamesRepository.createGame(gameName);
  return game;
}

async function editGame(gameId: number, gameName: string) {
  const doesGameExist = await gamesRepository.getGameByName(gameName);
  if (doesGameExist) throw conflictError('Game');

  const game = await gamesRepository.editGame(gameId, gameName);

  if (!game) throw notFoundError('Game');
  return game;
}

async function deleteGame(gameId: number) {
  const game = await gamesRepository.deleteGame(gameId);

  if (!game) throw notFoundError('Game');
  return game;
}

export const gamesService = {
  getGames,
  getGameById,
  createGame,
  editGame,
  deleteGame,
};
