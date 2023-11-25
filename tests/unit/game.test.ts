import { generateGame, generateGameName } from '../factories/games-factory';
import { conflictError } from '@/errors/conflict-error';
import { gamesRepository } from '@/repositories/games-repository';
import { gamesService } from '@/services/games-service';

describe('POST /games', () => {
  it('should return an error when trying to add a repeated game', async () => {
    jest.spyOn(gamesRepository, 'getGameByName').mockResolvedValueOnce(generateGame());
    const spyCreateGame = jest.spyOn(gamesRepository, 'createGame');

    const promise = gamesService.createGame(generateGameName());
    expect(gamesRepository.getGameByName).toHaveBeenCalled();
    expect(spyCreateGame).not.toHaveBeenCalled();
    expect(promise).rejects.toEqual(conflictError('Game'));
  });

  it('should return created game', async () => {
    const mockedGame = generateGame();

    jest.spyOn(gamesRepository, 'getGameByName').mockResolvedValueOnce(null);
    jest.spyOn(gamesRepository, 'createGame').mockResolvedValueOnce(mockedGame);

    const response = await gamesService.createGame(mockedGame.name);
    expect(gamesRepository.getGameByName).toHaveBeenCalled();
    expect(gamesRepository.createGame).toHaveBeenCalled();
    expect(response).toEqual(mockedGame);
  });
});
