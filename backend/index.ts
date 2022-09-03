import 'dotenv/config';
import { loadCards } from './src/tools/cards';
import { loadGames } from './src/tools/games';
import { pcNotification } from './src/tools/notify';
import { createServer } from './src/networking/server';
import { createSocket } from './src/networking/socket';
import { startController } from './src/logic/controller';

const PORT = Number(process.env.PORT) || 3001;

loadCards();
loadGames();

const server = createServer(PORT);
createSocket(server);
startController();

pcNotification('Event cards started');
