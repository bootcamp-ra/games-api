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
