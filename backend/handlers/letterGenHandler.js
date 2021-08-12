

const letterGenHandler = async (server, client) => {
    // handles returning a random letter that a country in our countries table starts with
    // NOTE: doesn't take into account countries being unique yet

    const letters = (await client.queryArray(`SELECT SUBSTRING(country_name, 1, 1) AS letter
                                        FROM countries
                                        GROUP BY letter;`)).rows                                      
    
    

    const [letter] = letters[Math.floor(Math.random() * letters.length)]


    await server.json({ letter })
}

export default letterGenHandler