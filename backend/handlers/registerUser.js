import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { isEmail } from "https://deno.land/x/isemail/mod.ts";

async function passwordEncryptor(password) {
  const salt = await bcrypt.genSalt(8)
  const passwordEncrypted = await bcrypt.hash(password, salt)
  return passwordEncrypted
}

async function emailValidator(email, client) {
  if (email.length === 0) throw new Error('Email cannot be blank')
  if(!isEmail(email)) throw new Error('Must be valid email')
  if (email.length > 50) throw new Error('Email must be less than 50 characters')
  const [emailCheck] = (await client.queryObject(`SELECT 1 FROM users WHERE email = $1;`, email)).rows
  if (emailCheck) throw new Error('Email already in use')
}

async function usernameValidator(username, client){
  if (username.length === 0) throw new Error('Username cannot be blank')
  if (username.length > 20) throw new Error('Username must be less than 20 characters')
  const [usernameCheck] = (await client.queryArray(`SELECT 1 FROM users WHERE username = $1;`, username)).rows
  if (usernameCheck) throw new Error('Username already in use')
  const acceptedCharacters = '1234567890qwertyuiopasdfghjklzxcvbnm'
  if (!(username.split('').every(character => acceptedCharacters.includes(character.toLowerCase())))) throw new Error('Username can only include numbers and letters')
}

function passwordValidator(password, passwordConfirmation) {
  const numbers = '1234567890'
  const letters = 'qwertyuiopasdfghjklzxcvbnm'
  if (!(password.split('').some(character => numbers.includes(character.toLowerCase())))) throw new Error('Password must include at least one number')
  if (!(password.split('').some(character => letters.includes(character.toLowerCase())))) throw new Error('Password must include at least one letter')
  if (password.length < 8 || password.length > 30) throw new Error('Passwords must be between 8 and 30 characters')
  if (password !== passwordConfirmation) throw new Error('Passwords must be equal')
}

async function signUpValidator(email, username, password, passwordConfirmation, client) {
  await emailValidator(email, client)
  await usernameValidator(username, client)
  passwordValidator(password, passwordConfirmation)
}

const registerUser = async (server, client) => {
  
  //retrieve typed details from form elements from front-end
  let { email, username, country, password, passwordConfirmation, saveScore } = await server.body;
  //make email and username non case sensitive
  email = email.toLowerCase()
  username = username.toLowerCase()

  
  //retrieve any EXISTING user details from database for provided/typed username/email and throw error if a user already exists and send back to front-end
  const [countryExists] = (await client.queryArray(`
    SELECT 1 FROM countries
    WHERE country_name = $1`,
    country)).rows
  country = countryExists ? country : null
  
  try {
    await signUpValidator(email, username, password, passwordConfirmation, client)
  } catch (err) {
    return await server.json({message: err.message})
  }
  
  //generate encrypted password
  const passwordEncrypted  = await passwordEncryptor(password)
  
  
  //save encrypted password with username into users table
  await client.queryObject(`
    INSERT INTO users(username, email, password_encrypted, country, created_at, updated_at) 
    VALUES ($1, $2, $3, $4, NOW(), NOW());`,
    username, email, passwordEncrypted, country);
  

  // saving game to finished games if user signing up from game end screen and deleting from current games
  if (saveScore) {
    const { tempUser } = await server.cookies
    try {
      const [[score]] = (await client.queryArray(`
        SELECT score
        FROM current_games
        WHERE username = $1`,
        tempUser)).rows
      await client.queryObject(`
        INSERT INTO finished_games(username, country, score, created_at)
        VALUES($1, $2, $3, NOW())`,
        username, country, score)
      await client.queryObject(`
        DELETE FROM current_games
        WHERE username = $1`,
        tempUser)
      await server.setCookie({
        name: "tempUser",
        value: "",
        path: "/",
        secure: Deno.env.get('DENO_ENV') === 'production',
        sameSite: Deno.env.get('DENO_ENV') === 'production' ? 'none' : 'lax',
        expires: new Date(0),
      });
      return await server.json({message: 'Success and score saved'})
    }
    catch { return await server.json({message: 'Successful signup but score not saved'})}
  }
  
  await server.json({message: 'Success'}) //return to stories page after submission
  
}

export default registerUser