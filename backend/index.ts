import 'dotenv/config';
import { loadCards } from './src/tools/cards';
import { loadGames } from './src/tools/games';
import { pcNotification } from './src/tools/notify';
import { createServer } from './src/networking/server';
import { createSocket } from './src/networking/socket';

const PORT = Number(process.env.PORT) || 3001;

loadCards();
loadGames();

const server = createServer(PORT);
createSocket(server);
pcNotification('Event cards started');
