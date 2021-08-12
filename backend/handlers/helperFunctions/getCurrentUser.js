export default async function getCurrentUser(server, client){
    const { sessionID } = await server.cookies

    try {
        const [user] = (await client.queryObject(`
        SELECT users.* FROM users 
        JOIN sessions 
        ON users.id = sessions.user_id 
        WHERE uuid=$1 AND NOW() < expires_at`
        , sessionID)).rows
        return user
    } catch {
        return null
    }
    
    
  }