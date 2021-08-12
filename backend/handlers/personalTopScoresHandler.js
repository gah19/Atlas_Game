import getCurrentUser from './helperFunctions/getCurrentUser.js'

const dateFilters = {
    all: true,
    day: 1,
    week: 7,
    month: 31,
    year: 365
}

export default async function personalTopScoresHandler(server, client) {
    let { dateFilter } = server.params
    dateFilter = dateFilters[dateFilter] ? dateFilters[dateFilter] : true
    const tableLength = 20
    const currentUser = await getCurrentUser(server, client)
    let gameData = []
    if (currentUser) {
        if (dateFilter === true) {
            gameData = (await client.queryObject(`
                SELECT (RANK() OVER (ORDER BY score DESC))::integer AS ranking, username, score, created_at
                FROM finished_games
                WHERE username = $1
                ORDER BY ranking
                LIMIT $2`,
                currentUser.username, tableLength)).rows 
        } else {
            gameData = (await client.queryObject(`
                SELECT (RANK() OVER (ORDER BY score DESC))::integer AS ranking, username, score, created_at
                FROM finished_games
                WHERE username = $1
                AND created_at > (NOW() - $2 * interval '1 day')
                ORDER BY ranking
                LIMIT $3`,
                currentUser.username, dateFilter, tableLength)).rows
        }

        
    }
    await server.json({gameData}) 
}


