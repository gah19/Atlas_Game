import getCurrentUser from "./getCurrentUser.js"

async function getUserFromCookies(server, client) {
    // finds the user from any cookies, prioritising registered log-ins over temporary users
    let user
    const { sessionID, tempUser } = await server.cookies
    if (sessionID) {
        const userData = await getCurrentUser(server, client)
        if (userData) user = userData.username
        if (!userData) throw new Error('Session has expired. Please log back in to continue or refresh to play as guest.')
    } else if (tempUser) {
        user = tempUser
    }

    if (user) return user
    if (!user) return undefined
}

export default getUserFromCookies