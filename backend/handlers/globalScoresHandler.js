const dateFilters = {
    all: true,
    day: 1,
    week: 7,
    month: 31,
    year: 365
}

export default async function globalScoresHandler(server, client) {
    let { dateFilter, country } = server.params
    dateFilter = dateFilters[dateFilter] ? dateFilters[dateFilter] : true

    // split country name in url 
    country = country.split('%20').join(' ')

    const [countryExists] = (await client.queryArray(`
        SELECT 1 FROM countries
        WHERE country_name = $1`,
        country)).rows
    country = countryExists ? country : 'world'
    const tableLength = 20
    let gameData = []
    if (dateFilter === true) {
        if (country === 'world') {
            gameData = (await client.queryObject(`
            SELECT (RANK() OVER (ORDER BY score DESC))::integer AS ranking, username, country, score, created_at
            FROM finished_games
            ORDER BY ranking
            LIMIT $1`,
            tableLength)).rows
        } else {
            gameData = (await client.queryObject(`
            SELECT (RANK() OVER (ORDER BY score DESC))::integer AS ranking, username, country, score, created_at
            FROM finished_games
            WHERE country = $1
            ORDER BY ranking
            LIMIT $2`,
            country, tableLength)).rows
        }
        
    } else {
        if (country === 'world') {
            gameData = (await client.queryObject(`
                SELECT (RANK() OVER (ORDER BY score DESC))::integer AS ranking, username, country, score, created_at
                FROM finished_games
                WHERE created_at > (NOW() - $1 * interval '1 day')
                ORDER BY ranking
                LIMIT $2`,
                dateFilter, tableLength)).rows
        } else {
            gameData = (await client.queryObject(`
                SELECT (RANK() OVER (ORDER BY score DESC))::integer AS ranking, username, country, score, created_at
                FROM finished_games
                WHERE created_at > (NOW() - $1 * interval '1 day')
                AND country = $2
                ORDER BY ranking
                LIMIT $3`,
                dateFilter, country, tableLength)).rows
        }

    }
    await server.json({gameData})
}