import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { cardPath, gamePath, sessionPath } from 'shared';
import { cardRouter } from './routers/cardRouter';
import { gameRouter } from './routers/gameRouter';
import { sessionRouter } from './routers/sessionRouter';
import { errorHandler, unknownEndpoint } from './middleware';

export function createServer(port: number) {
    const app = express();

    app.use(express.json());
    app.use(express.static('build'));
    app.use(cors());
    app.use(morgan('tiny'));

    //====| base routes |====//

    app.get('/api/test', (req, res) => {
        res.send('Hello world');
    });

    app.get('/api/exit', (req, res) => {
        res.send('Exiting server');
        process.exit(0);
    });

    //====| routers |====//

    app.use(cardPath, cardRouter);
    app.use(gamePath, gameRouter);
    app.use(sessionPath, sessionRouter);

    //====| static files |====//

    app.get('*', (req, res, next) => {
        const path = (req as any).params['0'];
        if (!path.includes('/api/')) {
            res.sendFile(`${__dirname}/index.html`);
        } else {
            next();
        }
    });

    //====| middleware |====//

    app.use(unknownEndpoint);
    app.use(errorHandler);

    //====| start server |====//

    return app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}