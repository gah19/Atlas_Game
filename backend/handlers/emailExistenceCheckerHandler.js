

export default async function emailExistanceCheckerHandler(server, client) {
    const { email } = await server.body
    const [emailCheck] = (await client.queryArray(`SELECT 1 FROM users WHERE email = $1;`, email)).rows
    await server.json({uniqueEmail: !emailCheck})
}