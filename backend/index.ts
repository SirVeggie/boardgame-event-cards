import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { cardRouter } from './src/routers/cardRouter';
import { errorHandler, unknownEndpoint } from './src/middleware';
import { cardPath, gamePath } from 'shared';
import { gameRouter } from './src/routers/gameRouter';
import { loadCards } from './src/tools/cards';
import { loadGames } from './src/tools/games';
import { pcNotification } from './src/tools/notify';

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

//====| static files |====//

app.get('*', (req, res, next) => {
    const path = (req as any).params['0'];
    if (path.includes('/app/')) {
        res.sendFile(`${__dirname}/index.html`);
    } else {
        next();
    }
});

//====| middleware |====//

app.use(unknownEndpoint);
app.use(errorHandler);

//====| start server |====//

loadCards();
loadGames();

pcNotification('Event cards started');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
