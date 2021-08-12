import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts' // environment variables

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

// fetches country capital cities
async function countryAndCapital() {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/capital")
    const parsed = await response.json()
    const countries = parsed.data
    return countries
}

let countries = await countryAndCapital()

async function countryAndFlag() {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images")
    const parsed = await response.json()
    const flags = parsed.data
    return flags
}

let flags = await countryAndFlag()

countries.forEach(async (country) => await client.queryObject("INSERT INTO countries (country_name, capital, created_at) VALUES($1, $2, NOW())", country.name, country.capital))
flags.forEach(async (flag) => await client.queryObject("UPDATE countries SET flag = $1 WHERE country_name = $2", flag.flag, flag.name))

let nonUNCountries = ['Wallis and Futuna', 'Saint Barthelemy', 'Bermuda', 'Bouvet Island', 'Bonaire, Saint Eustatius and Saba ', 'Réunion', 'Tokelau', 'Guam', 'South Georgia and the South Sandwich Islands', 'Guadeloupe', 'Guernsey', 'Greenland', 'Gibraltar', 'Hong Kong', 'Heard Island and McDonald Islands', 'Vatican City State (Holy See)', 'Svalbard and Jan Mayen', 'French Polynesia', 'Pitcairn', 'Saint Pierre and Miquelon', 'Cocos (Keeling) Islands', 'Saint Martin', 'Macau', 'Martinique', 'Northern Mariana Islands', 'Montserrat', 'Isle of Man', 'British Indian Ocean Territory', 'Saint Helena', 'Falkland Islands', 'Faroe Islands', 'New Caledonia', 'Norfolk Island', 'Cocos Islands', 'Christmas Island', 'Curacao', 'Sint Maarten', 'Cayman Islands', 'British Virgin Islands', 'Mayotte', 'United States Minor Outlying Islands', 'French Southern Territories', 'Turks and Caicos Islands', 'Anguilla', 'U.S. Virgin Islands', 'Antarctica', 'American Samoa', 'Aruba', 'Aland Islands', 'Puerto Rico']

// macedonia is now called north macedonia
await client.queryObject(`
    UPDATE countries
    SET country_name = 'North Macedonia'
    WHERE country_name = 'Macedonia'`)

// change palestinian terrotories to palestine
await client.queryObject(`
    UPDATE countries
    SET country_name = 'Palestine'
    WHERE country_name = 'Palestinian Territory'`)
    
await client.queryObject(`
    UPDATE countries
    SET country_name = 'Eswatini'
    WHERE country_name = 'Swaziland'`)

await client.queryObject(`
    UPDATE countries
    SET country_name = 'Vatican City'
    WHERE country_name = 'Vatican'`)

// deleting all countries that aren't on the UNs website of official countries
nonUNCountries.forEach(async (country) => await client.queryObject(`
    DELETE FROM countries
    WHERE country_name = $1`,
    country))

// hard-coding missing flags
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg', 'Russia')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Bandera_de_Bolivia_%28Estado%29.svg', 'Bolivia')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Flag_of_Venezuela_%28state%29.svg', 'Venezuela')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/7/76/Flag_of_Western_Sahara.png', 'Western Sahara')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/2/27/Flag_of_Moldova.svg', 'Moldova')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/3/38/Flag_of_Tanzania.svg', 'Tanzania')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_North_Macedonia.svg', 'North Macedonia')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_Palestine.svg', 'Palestine')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Flag_of_the_Federated_States_of_Micronesia.svg', 'Micronesia')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Flag_of_Kosovo.svg', 'Kosovo')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_C%C3%B4te_d%27Ivoire.svg', 'Ivory Coast')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_the_Republic_of_the_Congo.svg', 'Republic of the Congo')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg', 'Democratic Republic of the Congo')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flag_of_South_Sudan.svg', 'South Sudan')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg', 'South Korea')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/5/51/Flag_of_North_Korea.svg', 'North Korea')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Libya.svg', 'Libya')
await client.queryObject(`UPDATE countries SET flag = $1 WHERE country_name = $2;`, 'https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_the_Vatican_City.svg', 'Vatican City')








