import prisma from "@/database/database"

async function getGames() {
    const games = await prisma.game.findMany()
    return games
}

async function getGameById(gameId: number) {
    const game = await prisma.game.findUnique({
        where: {
            id: gameId
        }
    })
    return game
}

async function createGame(gameName: string) {
    const game = await prisma.game.create({
        data: {
            name: gameName
        }
    })
    return game
}

async function editGame(gameId: number, gameName: string) {
    const game = await prisma.game.update({
        where: {
            id: gameId
        },
        data: {
            name: gameName
        }
    })
    return game
}

async function deleteGame(gameId: number) {
    const game = await prisma.game.delete({
        where: {
            id: gameId
        }
    })
    return game
}

export const gamesRepository = {
    getGames,
    getGameById,
    createGame,
    editGame,
    deleteGame
}
