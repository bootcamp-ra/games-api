import { createGame, deleteGame, editGame, getGameById, getGames } from "@/controllers/games-controller"
import { validateSchemaMiddleware } from "@/middlewares/schema-validation-middleware"
import { gameInputSchema } from "@/schemas/games-schemas"
import { Router } from "express"

const gamesRouter = Router()

gamesRouter.get("/", getGames)
gamesRouter.get("/:id", getGameById)
gamesRouter.post("/", validateSchemaMiddleware(gameInputSchema), createGame)
gamesRouter.put("/:id", validateSchemaMiddleware(gameInputSchema), editGame)
gamesRouter.delete("/:id", deleteGame)

export default gamesRouter