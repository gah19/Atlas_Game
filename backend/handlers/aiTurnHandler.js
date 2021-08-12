
import getUserFromCookies from "./helperFunctions/getUserFromCookies.js"


async function letterSolutionChecker(lastLetter, countryArray, client) {
    let timesTried = 0
    let foundSolution = false
    const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    let aiCountries = []
    let filteredAiCountries = []
    
    while (!foundSolution) { 
        // find all possible right answers for this letter
        aiCountries = (await client.queryArray(`SELECT country_name
                                                    FROM countries 
                                                    WHERE LOWER(SUBSTRING(country_name, 1, 1)) = $1;`, lastLetter.toLowerCase())).rows

        // turn array of arrays into 1D array of strings                                                  
        aiCountries = aiCountries.flat()                                                  

        filteredAiCountries = aiCountries.filter(country => !countryArray.includes(country))

        if (filteredAiCountries.length > 0) {
            foundSolution = true
        
        } else {
            let letterIndex = alphabet.findIndex(elem => elem === lastLetter.toLowerCase())
            if (letterIndex === -1) throw new Error("How did you get here?")
            if (letterIndex === 25) letterIndex = -1 // accounts for ending with Z
            lastLetter = alphabet[letterIndex + 1] // set lastLetter equal to new letter, to loop back through and check
            
        }

        timesTried += 1
        if (timesTried > 26) break // after checking every letter once, break out of loop with foundSolution still false
    } 

    if (!foundSolution) {
        return []
    } else {
        return [lastLetter, filteredAiCountries]
    }
}

async function aiTurnHandler(server, client) {
    let { lastLetter } = await server.body
    const savedLastLetter = lastLetter
  

    // finds user, prioritising registered log in over temporary users
    const user = await getUserFromCookies(server, client)
    if (!user) throw new Error("Game started without user")

    // get current countries that have been played
    let [[countryArray]] = (await client.queryArray(`SELECT played_countries FROM current_games WHERE username = $1;`, user)).rows
    countryArray = JSON.parse(countryArray)

    let filteredAiCountries
    // checks if there are any solutions to this letter
    [lastLetter, filteredAiCountries] = await letterSolutionChecker(lastLetter, countryArray, client)

    if (!lastLetter) {
        const allCountriesPlayed = true
        await server.json({allCountriesPlayed})

    } else {

        //select random country from possible right answers
        const aiCountryChoice = filteredAiCountries[Math.floor(Math.random() * filteredAiCountries.length)]

        // add it to the array of played countries
        countryArray.push(aiCountryChoice)
        
        // re-stringify and update current_game table
        await client.queryObject(`UPDATE current_games
                                SET played_countries = $1, updated_at = NOW()
                                WHERE username = $2;`, JSON.stringify(countryArray), user)

        // return the AI's chosen country to the frontend
        lastLetter = aiCountryChoice.slice(-1)

         // checks if there are any solutions to this letter before we send it to player
        let [userLetter] = await letterSolutionChecker(lastLetter, countryArray,client)
        if (!userLetter) {    
            await server.json({allCountriesPlayed: true})
        } else {
            let countryLooped = false
            if (savedLastLetter.toLowerCase() != aiCountryChoice[0].toLowerCase() || userLetter.toLowerCase() != aiCountryChoice.slice(-1).toLowerCase()) {
                // if ai didn't have an answer to the player's last letter 
                countryLooped = true
            }
            await server.json({aiCountryChoice, letter: userLetter.toUpperCase(), countryLooped})
        }
    }
}

export default aiTurnHandler