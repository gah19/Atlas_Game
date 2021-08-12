
export default async function allCountries(server, client) {
    let allCountries = (await client.queryArray(`SELECT country_name FROM countries`)).rows
    allCountries = allCountries.flat()
    await server.json(allCountries)
}