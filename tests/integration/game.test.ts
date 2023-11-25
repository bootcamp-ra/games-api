import supertest from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app';
import { cleanDB } from '../clean-db';
import { generateGameName } from '../factories/games-factory';
import { gamesRepository } from '@/repositories/games-repository';
import prisma from '@/database/database';

const api = supertest(app);

beforeEach(async () => {
  await cleanDB();
});

describe('GET /games', () => {
  it('should return status 200 and array of games', async () => {
    const game1 = { name: generateGameName() };
    const game2 = { name: generateGameName() };
    const spyGetGames = jest.spyOn(gamesRepository, 'getGames');

    await prisma.game.createMany({ data: [game1, game2] });

    const { status, body } = await api.get('/games');

    expect(status).toBe(httpStatus.OK);
    expect(spyGetGames).toHaveBeenCalledTimes(1);
    expect(body).toHaveLength(2);
    expect(body).toEqual([
      {
        id: expect.any(Number),
        name: game1.name,
      },
      {
        id: expect.any(Number),
        name: game2.name,
      },
    ]);
  });
});

describe('GET /games/:id', () => {
  it('should return status 422 and error when id is in wrong format', async () => {
    const spyGetGame = jest.spyOn(gamesRepository, 'getGameById');

    const { status, text } = await api.get('/games/wrong-id');

    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    expect(spyGetGame).not.toHaveBeenCalled();
    expect(text).toEqual(`Insert a valid id!`);
  });

  it('should return status 200 one game', async () => {
    const game = { name: generateGameName() };
    const spyGetGame = jest.spyOn(gamesRepository, 'getGameById');

    const createdGame = await prisma.game.create({ data: game });

    const { status, body } = await api.get(`/games/${createdGame.id}`);

    expect(status).toBe(httpStatus.OK);
    expect(spyGetGame).toHaveBeenCalledTimes(1);
    expect(body).toEqual({
      id: expect.any(Number),
      name: game.name,
    });
  });
});

describe('POST /games', () => {
  it('should return status 422 and not add game to db when body is invalid', async () => {
    const invalidBody = {};
    const spyCreateGame = jest.spyOn(gamesRepository, 'createGame');

    const { status, body } = await api.post('/games').send(invalidBody);

    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    expect(spyCreateGame).not.toHaveBeenCalled();
    expect(body).toEqual({ error: expect.any(String) });
  });

  it('should return status 201 and add a game to db', async () => {
    const mockedGame = { name: generateGameName() };
    const spyCreateGame = jest.spyOn(gamesRepository, 'createGame');

    const { status, body } = await api.post('/games').send(mockedGame);
    const game = await prisma.game.findFirst({ where: { name: mockedGame.name } });

    expect(status).toBe(httpStatus.CREATED);
    expect(spyCreateGame).toHaveBeenCalledTimes(1);
    expect(body).toEqual({
      id: expect.any(Number),
      name: mockedGame.name,
    });
    expect(game).toEqual({
      id: expect.any(Number),
      name: mockedGame.name,
    });
  });
});

describe('PUT /games/:id', () => {
  it('should return status 422 and not edit game on db when body is invalid', async () => {
    const invalidBody = {};
    const spyEditGame = jest.spyOn(gamesRepository, 'editGame');
    const createdGame = { name: generateGameName() };
    const game = await prisma.game.create({ data: { name: createdGame.name } });

    const { status, body } = await api.put(`/games/${game.id}`).send(invalidBody);

    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    expect(spyEditGame).not.toHaveBeenCalled();
    expect(body).toEqual({ error: expect.any(String) });
  });

  it('should return status 422 and error when id is in wrong format', async () => {
    const spyEditGame = jest.spyOn(gamesRepository, 'editGame');
    const game = { name: generateGameName() };

    const { status, text } = await api.put('/games/wrong-id').send(game);

    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    expect(spyEditGame).not.toHaveBeenCalled();
    expect(text).toEqual(`Insert a valid id!`);
  });

  it('should return status 200 and change a games data on db', async () => {
    const createdGame = { name: generateGameName() };
    const updatedGame = { name: generateGameName() };
    const spyEditGame = jest.spyOn(gamesRepository, 'editGame');
    const gameBeforeEdit = await prisma.game.create({ data: { name: createdGame.name } });

    const { status, body } = await api.put(`/games/${gameBeforeEdit.id}`).send(updatedGame);
    const gameAfterEdit = await prisma.game.findFirst({ where: { id: gameBeforeEdit.id } });

    expect(status).toBe(httpStatus.OK);
    expect(spyEditGame).toHaveBeenCalledTimes(1);
    expect(gameAfterEdit.name).toBe(updatedGame.name);
    expect(gameAfterEdit.name).not.toBe(createdGame.name);
    expect(body).toEqual({
      id: expect.any(Number),
      name: updatedGame.name,
    });
  });
});

describe('DELETE /games/:id', () => {
  it('should return status 422 and error when id is in wrong format', async () => {
    const spyDeleteGame = jest.spyOn(gamesRepository, 'deleteGame');

    const { status, text } = await api.delete('/games/wrong-id');

    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    expect(spyDeleteGame).not.toHaveBeenCalled();
    expect(text).toEqual(`Insert a valid id!`);
  });

  it('should return status 200 and delete the game from db', async () => {
    const spyDeleteGame = jest.spyOn(gamesRepository, 'deleteGame');
    const createdGame = await prisma.game.create({ data: { name: generateGameName() } });

    const { status, body } = await api.delete(`/games/${createdGame.id}`);
    const gameAfterDelete = await prisma.game.findUnique({ where: { id: createdGame.id } });

    expect(status).toBe(httpStatus.OK);
    expect(spyDeleteGame).toHaveBeenCalledTimes(1);
    expect(gameAfterDelete).toBe(null);
    expect(body).toEqual(createdGame);
  });
});
