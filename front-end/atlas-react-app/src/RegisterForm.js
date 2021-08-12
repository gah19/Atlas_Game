import React from 'react'
import UniqueUsernameError from './UniqueUsernameError'
import UniqueEmailError from './UniqueEmailError'
import './register.css'
import Filter from 'bad-words'
import { Link } from 'react-router-dom'
import * as validEmailCheck from 'email-validator'

function RegisterForm(props){
    const { handleSubmit, handleChange, email, username, password, passwordConfirmation, country, handleBlur, touched, message, allCountries } = props
    let validSignup 
   try {
        signUpValidator(email, username, password, passwordConfirmation, touched)
        validSignup = true
    } catch (err) {}
    
    const [emailError, usernameError, passwordError, passwordConfirmationError] = createErrorMessages(email, username, password, passwordConfirmation, touched)
    
    const countryOptions = allCountries.map((country, i) => {return <option key={i} value={country}>{country}</option>})

    return (
            <div>
            <form className = 'register-form' onSubmit={handleSubmit}>
            <div className='register-inputs'>
                <label className = 'registerationlabel'>Email:
                        <input 
                            onChange={handleChange}
                            onBlur={(event) => handleBlur(event)}
                            name='email' 
                            type='email'
                            value={email}
                        />
                </label>
                <div className = 'registerformerrormessage'>
                <p>{emailError || message}</p>
                <UniqueEmailError email={email} touched={touched.email}/>
                </div>


                <label className = 'registerationlabel'>Username:
                    <input 
                        onChange={handleChange}
                        onBlur={(event) => handleBlur(event)}
                        name='username' 
                        type='text'
                        value={username}
                    />
                </label>
                <div className = 'registerformerrormessage'>
                <p>{usernameError}</p>
                <UniqueUsernameError username={username} touched={touched.username}/>
                </div>

                <label className = 'registerationlabel'>Country:
                    <select name='country' value={country} onChange={handleChange}>
                        <option value="">Select a country or leave blank</option>
                            {countryOptions}
                    </select>
                </label>

                <label className = 'registerationlabel'>Password:
                    <input 
                        onChange={handleChange}
                        onBlur={(event) => handleBlur(event)}
                        name='password'
                        type='password'
                        value={password}
                        minLength="8" required  
                    />
                </label>
                <div className = 'registerformerrormessage'>
                <p>{passwordError}</p>
                </div>

                <label className = 'registerationlabel'>Confirm your password:
                    <input 
                        onChange={handleChange}
                        onBlur={(event) => handleBlur(event)}
                        name='passwordConfirmation'
                        type='password'
                        value={passwordConfirmation}
                        minLength="8" required  
                    />
                </label>
                <div className = 'registerformerrormessage'>
                <p>{passwordConfirmationError}</p>
                </div>
                </div>  
                { message === 'Success and score saved' ? <div className='endgame-success'>{message}</div> :
                <button className = 'buttonform' 
                type="submit"
                disabled= {!validSignup || !touched.email || !touched.username || !touched.password}
                >
                Sign-up
                </button>}
                <p className="signin-link-message">Already got an account? Log in <Link to='/login' className="signin-link">here</Link>.</p>
            </form>
            </div>
    )
}

export default RegisterForm

function signUpValidator(email, username, password, passwordConfirmation, touched) {
    emailValidator(email, touched)
    usernameValidator(username, touched)
    passwordValidator(password, touched)
    if (password !== passwordConfirmation) throw new Error('Passwords must be equal')
  }
  
  function passwordValidator(password, touched) {
    if(!touched.password) return 
    const numbers = '1234567890'
    const letters = 'qwertyuiopasdfghjklzxcvbnm'
    if (password.length < 8 || password.length > 30) throw new Error('Passwords must be between 8 and 30 characters')
    if (!(password.split('').some(character => numbers.includes(character.toLowerCase())))) throw new Error('Password must include at least one number')
    if (!(password.split('').some(character => letters.includes(character.toLowerCase())))) throw new Error('Password must include at least one letter')
  }
  
  function usernameValidator(username, touched){
    if(!touched.username) return 
    if (username.length === 0) throw new Error('Username cannot be blank')
    if (username.length > 20) throw new Error('Username must be less than 20 characters')
    const acceptedCharacters = '1234567890qwertyuiopasdfghjklzxcvbnm'
    if (!(username.split('').every(character => acceptedCharacters.includes(character.toLowerCase())))) throw new Error('Username can only include numbers and letters')

    // check all possible substrings for profanity
    const filter = new Filter()

    for (let lslicer = 0; lslicer < username.length; lslicer++) {
        for (let rslicer = 1; rslicer < username.length+1; rslicer++) {
            const substring = username.slice(lslicer, rslicer)
            if (filter.isProfane(substring)) throw new Error('Username cannot include profanity')
        }
    }
  }
  
  function emailValidator(email, touched) {
    if(!touched.email) return 
    if (email.length === 0) throw new Error('Email cannot be blank')
    if (!validEmailCheck.validate(email)) throw new Error('Invalid email')
  }

  function createErrorMessages(email, username, password, passwordConfirmation, touched) {  
    let emailError, usernameError, passwordError, passwordConfirmationError
    try {
        emailValidator(email, touched)
    } catch (err) {
        emailError = err.message
    }
    try {
        usernameValidator(username, touched)
    } catch (err) {
        usernameError = err.message
    }
    try {
        passwordValidator(password, touched)
    } catch (err) {
        passwordError = err.message
    }
    if (touched.passwordConfirmation && password !== passwordConfirmation ) passwordConfirmationError = 'Passwords must be equal'
    return [emailError, usernameError, passwordError, passwordConfirmationError]
  }