import express, { json, Request, Response } from 'express';
import 'express-async-errors';
import httpStatus from 'http-status';
import errorHandlerMiddleware from '@/middlewares/error-middleware';
import gamesRouter from '@/routers/games-router';

const app = express();

app.use(json()); 

app.get('/health', (req: Request, res: Response) => {
    return res.status(httpStatus.OK).send("I'm ok!");
});
app.use('/games', gamesRouter);
app.use(errorHandlerMiddleware);

export default app;