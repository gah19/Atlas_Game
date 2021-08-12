import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

import { v4 } from "https://deno.land/std/uuid/mod.ts";



export default async function loginHandler(server, client) {
    let { usernameOrEmail, password } = await server.body
    // make username non case sensitive
    usernameOrEmail = usernameOrEmail.toLowerCase()
    const [userInfo] = (await client.queryObject(`
        SELECT id, password_encrypted FROM users 
        WHERE username = $1 OR email = $1`,
        usernameOrEmail)).rows

    try{
        if (!userInfo) throw new Error('User doesnt exist - please try again')
        const passwordCorrect = await bcrypt.compare(password, userInfo.password_encrypted)
        if (!passwordCorrect) throw new Error('Invalid password')
        const sessionID = v4.generate()
        await client.queryArray(`
            INSERT INTO sessions (uuid, user_id, created_at, expires_at) 
            VALUES ($1, $2, NOW(),(NOW() + interval '7 days'))`,
            sessionID, userInfo.id);
        server.setCookie({
            name: "sessionID",
            value: sessionID,
            path: "/",
            secure: Deno.env.get('DENO_ENV') === 'production',
            sameSite: Deno.env.get('DENO_ENV') === 'production' ? 'none' : 'lax',
            expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) // expiry optional
        });
        return await server.json({ message: 'Success' })
    } catch(error){
        return await server.json({ message: error.message })
    }
}

