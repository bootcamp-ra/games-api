import prisma from '../src/database/database';

export async function cleanDB() {
  await prisma.game.deleteMany();
}
