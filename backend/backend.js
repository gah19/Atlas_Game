import { Application } from 'https://deno.land/x/abc@v1.3.1/mod.ts'
import { cors } from 'https://deno.land/x/abc@v1.3.1/middleware/cors.ts'
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import registerUser from './handlers/registerUser.js'
import letterGenHandler from './handlers/letterGenHandler.js';
import startGameHandler from './handlers/startGameHandler.js';
import loginHandler from './handlers/loginHandler.js';
import updateGameHandler from './handlers/updateGameHandler.js';
import sessionsHandler from './handlers/sessionsHandler.js'
import logoutHandler from './handlers/logoutHandler.js'
import globalScoresHandler from './handlers/globalScoresHandler.js'
import personalTopScoresHandler from './handlers/personalTopScoresHandler.js'
import aiTurnHandler from './handlers/aiTurnHandler.js'
import endgameDataHandler from './handlers/endgameDataHandler.js'
import usernameExistanceCheckerHandler from './handlers/usernameExistenceCheckerHandler.js'
import emailExistanceCheckerHandler from './handlers/emailExistenceCheckerHandler.js'
import getMatchesForLetter from './handlers/getMatchesForLetter.js'
import capitalCityCheck from './handlers/capitalCityHandler.js'
import allCountries from './handlers/allCountries.js'

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'

config({ path: `./.env.${DENO_ENV}`, export: true })
const client = new Client(Deno.env.get('PG_URL'))
await client.connect()

const app = new Application()
const PORT = Number(Deno.env.get('PORT'))

const headersWhitelist = [
    "Authorization",
    "Content-Type",
    "Accept",
    "Origin",
    "User-Agent",
]
app.use(cors({ allowHeaders: headersWhitelist, allowCredentials: true, allowOrigins: Deno.env.get('ALLOWED_ORIGINS')}))

app
    .post('/sessions', (server) => loginHandler(server, client))
    .post('/users', (server) => registerUser(server, client))
    .get('/sessions/exists', (server) => sessionsHandler(server, client))
    .get('/letter', (server) => letterGenHandler(server, client))
    .post('/game/new', (server) => startGameHandler(server, client))
    .post('/game', (server) => updateGameHandler(server, client))
    .delete('/sessions', (server) => logoutHandler(server, client))
    .get('/globalscores/:dateFilter/:country', (server) => globalScoresHandler(server, client))
    .get('/personaltopscores/:dateFilter', (server) => personalTopScoresHandler(server, client))
    .post('/game/ai', (server) => aiTurnHandler(server, client))
    .post('/endgamedata', (server) => endgameDataHandler(server, client))
    .post('/usernameexists', (server) => usernameExistanceCheckerHandler(server, client))
    .post('/emailexists', (server) =>  emailExistanceCheckerHandler(server, client))
    .post('/getmatches', (server) =>  getMatchesForLetter(server, client))
    .post('/game/city', (server) => capitalCityCheck(server, client))
    .get('/allcountries', (server) => allCountries(server, client))
    .start({ port: PORT })
console.log('server running on port:', PORT)

