import getUserFromCookies from "./helperFunctions/getUserFromCookies.js"
import getCountryArray from "./helperFunctions/getCountryArray.js"
import formatUserGameInput from "./helperFunctions/formatUserGameInput.js"



async function capitalCityCheck(server, client) {
    // handles the optional capital city question
    // needs the user input for capital city, and the cookies to find the user and therefore current_game/country array
    // if the answer is right, adds another point to the score of the current_game, and returns a boolean marking it as true
    // if the answer is wrong, returns a boolean marking it as false, which ends the game

    //define points for correct capital city
    const capitalCityPoints = 5

    const { userInputCity } = await server.body
    const city = formatUserGameInput(userInputCity)

    // finds user, prioritising registered log in over temporary users
    let user = await getUserFromCookies(server, client)
    if (!user) throw new Error ('No user detected')

     // backend timer to prevent them hacking the frontend clock to gain more time
     const backendTimer = (await client.queryObject("SELECT username FROM current_games WHERE username = $1 AND updated_at > NOW() - interval '20 seconds';",user)).rows
     
     if (backendTimer.length === 0){
         throw new Error('backend timeout')
     } 

    // finds country (most recent in current_games)
    const countryArray = await getCountryArray(user, client)
    const [lastCountry] = countryArray.slice(-1)

    const [[correctCity]] = (await client.queryArray(`SELECT capital 
                                                   FROM countries
                                                   WHERE country_name = $1;`, lastCountry)).rows
    
    const correctCityForm = formatUserGameInput(correctCity)


    let [[score]]  = (await client.queryArray(`SELECT score FROM current_games WHERE username = $1;`, user)).rows

    let isCorrectCity = false
    if (correctCityForm === city) {
        isCorrectCity = true

        // increase score for correct answer
        await client.queryObject(`UPDATE current_games
                                  SET score = $1, updated_at = NOW()
                                  WHERE username = $2;`, score + capitalCityPoints, user)
        score += capitalCityPoints
    }

    await server.json({isCorrectCity, correctCity, score})
}

export default capitalCityCheck