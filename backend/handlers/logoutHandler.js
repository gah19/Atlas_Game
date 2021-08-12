export default async function logoutHandler(server, client) {
    const { sessionID } = await server.cookies
    await client.queryArray(`
            DELETE FROM sessions 
            WHERE uuid = $1`,
            sessionID);
    await server.setCookie({
    name: "sessionID",
    value: "",
    path: "/",
    secure: Deno.env.get('DENO_ENV') === 'production',
    sameSite: Deno.env.get('DENO_ENV') === 'production' ? 'none' : 'lax',
    expires: new Date(0),
  });
  return await server.json({loggedOut: true})
}