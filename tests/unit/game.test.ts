import { generateGame, generateGameName } from '../factories/games-factory';
import { conflictError } from '@/errors/conflict-error';
import { notFoundError } from '@/errors/not-found-error';
import { gamesRepository } from '@/repositories/games-repository';
import { gamesService } from '@/services/games-service';

describe('GET /games/:id', () => {
  it('should return an error if game is not found', async () => {
    jest.spyOn(gamesRepository, 'getGameById').mockResolvedValueOnce(null);

    const promise = gamesService.getGameById(1);
    expect(gamesRepository.getGameById).toHaveBeenCalled();
    expect(promise).rejects.toEqual(notFoundError('Game'));
  });

  it('should return a game if id is valid and existing', async () => {
    const mockedGame = generateGame();

    jest.spyOn(gamesRepository, 'getGameById').mockResolvedValueOnce(mockedGame);

    const game = await gamesService.getGameById(mockedGame.id);
    expect(gamesRepository.getGameById).toHaveBeenCalled();
    expect(game).toEqual(mockedGame);
  });
});

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

describe('PUT /games/:id', () => {
  it('should return an error if game is not found', async () => {
    jest.spyOn(gamesRepository, 'getGameById').mockResolvedValueOnce(null);
    const spyEditGame = jest.spyOn(gamesRepository, 'editGame');

    const promise = gamesService.editGame(1, generateGameName());
    expect(gamesRepository.getGameById).toHaveBeenCalled();
    expect(spyEditGame).not.toHaveBeenCalled();
    expect(promise).rejects.toEqual(notFoundError('Game'));
  });

  it('should return an error when trying to edit to a repeated game name', async () => {
    const mockedGame = generateGame();
    jest.spyOn(gamesRepository, 'getGameById').mockResolvedValueOnce(mockedGame);
    jest.spyOn(gamesRepository, 'getGameByName').mockResolvedValueOnce(mockedGame);
    const spyEditGame = jest.spyOn(gamesRepository, 'editGame');

    const promise = gamesService.editGame(1, generateGameName());
    expect(spyEditGame).not.toHaveBeenCalled();
    expect(promise).rejects.toEqual(conflictError('Game'));
  });

  it('should return edited game', async () => {
    const mockedGame = generateGame();

    jest.spyOn(gamesRepository, 'getGameById').mockResolvedValueOnce(mockedGame);
    jest.spyOn(gamesRepository, 'getGameByName').mockResolvedValueOnce(null);
    jest.spyOn(gamesRepository, 'editGame').mockResolvedValueOnce(mockedGame);

    const response = await gamesService.editGame(1, mockedGame.name);
    expect(gamesRepository.editGame).toHaveBeenCalled();
    expect(response).toEqual(mockedGame);
  });
});

describe('DELETE /games/:id', () => {
  it('should return an error if game is not found', async () => {
    jest.spyOn(gamesRepository, 'getGameById').mockResolvedValueOnce(null);
    const spyDeleteGame = jest.spyOn(gamesRepository, 'deleteGame');

    const promise = gamesService.deleteGame(1);
    expect(gamesRepository.getGameById).toHaveBeenCalled();
    expect(spyDeleteGame).not.toHaveBeenCalled();
    expect(promise).rejects.toEqual(notFoundError('Game'));
  });

  it('should return deleted game????', async () => {
    const mockedGame = generateGame();

    jest.spyOn(gamesRepository, 'getGameById').mockResolvedValueOnce(mockedGame);
    jest.spyOn(gamesRepository, 'deleteGame').mockResolvedValueOnce(mockedGame);

    const response = await gamesService.deleteGame(mockedGame.id);
    expect(gamesRepository.deleteGame).toHaveBeenCalled();
    expect(response).toEqual(mockedGame);
  });
});
