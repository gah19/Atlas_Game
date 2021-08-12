export default async function getCountryArray(user, client) {
    let [[countryArray]] = (await client.queryArray(`SELECT played_countries FROM current_games WHERE username = $1;`, user)).rows

    if (countryArray) countryArray = JSON.parse(countryArray); // parse the JSON stringified array
    if (!countryArray) countryArray = []
    return countryArray
}