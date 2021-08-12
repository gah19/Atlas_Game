import getUserFromCookies from "./helperFunctions/getUserFromCookies.js"
import getCountryArray from "./helperFunctions/getCountryArray.js"


export default async function getMatchesForLetter(server, client) {
    const { letter } = await server.body

    // finds user, prioritising registered log in over temporary users
    let user = await getUserFromCookies(server, client)
    if (!user) throw new Error ('No user detected')

    // find already played countries in this game
    const countryArray = await getCountryArray(user, client)

    // pass through list of what countries would have been correct answers
    // DAVID'S NOTE: the edge case of no correct answers is not possible, as we check that on the AI turn before giving the letter
    let allMatches = (await client.queryArray(`
        SELECT country_name
        FROM countries
        WHERE LOWER(SUBSTRING(country_name, 1, 1)) = $1;`,
         letter.toLowerCase())).rows
    
    // filter out those that have been played
    allMatches = allMatches.flat()
    allMatches = allMatches.filter(country => !countryArray.includes(country))

    await server.json({allMatches})
}