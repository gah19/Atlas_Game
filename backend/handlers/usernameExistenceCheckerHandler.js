export default async function usernameExistanceCheckerHandler(server, client) {
    const { username } = await server.body
    const [usernameCheck] = (await client.queryArray(`SELECT 1 FROM users WHERE username = $1;`, username)).rows
    await server.json({uniqueUsername: !usernameCheck})
}