import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts' // environment variables

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()



await client.queryObject(
  `DROP TABLE IF EXISTS users, countries, sessions, current_games, finished_games;`
)

await client.queryObject(`CREATE TABLE countries (
                country_id SERIAL PRIMARY KEY,
                country_name TEXT UNIQUE NOT NULL,
                flag TEXT,
                capital TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL
                )`)

await client.queryObject(`CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                country TEXT, 
                password_encrypted TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL,
                updated_at TIMESTAMP NOT NULL
                )`)

await client.queryObject(`CREATE TABLE sessions (
                uuid TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )`)


await client.queryObject(`CREATE TABLE current_games (
                game_id SERIAL PRIMARY KEY,
                username TEXT,
                played_countries TEXT,
                score INTEGER DEFAULT 0,
                created_at TIMESTAMP NOT NULL,
                updated_at TIMESTAMP NOT NULL,
                FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
                )`)

await client.queryObject(`CREATE TABLE finished_games (
                fin_game_id SERIAL PRIMARY KEY,
                username TEXT NOT NULL,
                score INTEGER DEFAULT 0,
                country TEXT,
                created_at TIMESTAMP NOT NULL,
                FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
                )`)                

