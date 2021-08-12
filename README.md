# Atlas :earth_africa:: Group Project

In the final two weeks of the Sigma Labs traning, students were assigned to various group projects, one of which was the Atlas project. The Atlas team consisted of five members: David Ingram, Guy Hotchin, Joanna Hawthorne, Michael Baugh and Omid Wakili. 

Our motivation behind the project was to build an enjoyable game, which would challenge the player's knowledge of the countries of the world.

### How does the game work?

In its simplest form, between two players, player 1 is presented with a random letter of the alphabet. Player 1 has to name a country beginning with that letter. Player 2, in turn, has to name a country, which begins with the final letter of player 1's response. The two players then continue, in turn, each one naming another country beginning with the other's last letter. Failure to name a country results in loss of a player. 

In our first implementation, the user would be playing against the computer. The user would gain points for every correct country they can name, and they would lose if they fail to do so. The user could play as a guest, or sign up and login. As a logged in user, the player can keep track of their previous scores in a personal scoreboard. There is also a global scoreboard keeping track of the scores of all players on the site. 

In our second iteration, following correct naming of a country, the user then also has the option to the name the capital city of the said country. The user can skip this or take on this challenge for extra points! However, getting the capital city wrong would result in loss!

Some design decisions with regards to the game play:
- Timed turns: the user has to return a response within a specified (i.e. 15 seconds) time period
- Scoring: 10 points for naming a country correctly and 5 points for naming the capital city correctly
- All countries named: if all countries have been named then the game finished and the user scores are tallied up
- No choices left for letter: if all countries beginning with a specific letter have been named, the next letter alphabetically is presented instead as the next question
- Incorrect naming of country or capital city (including misspellings) results in loss of game
- Played countries: at the end of the game, the user can view the list of countries that were played during the game
- Possible countries: at the end of the game, the user can view a list of possible countries which they could have played for a letter if they got it wrong
- Correct capital city: at the end of the game, a user who incorrectly named a capital city can view the correct response


## Data Architecture: How we set up our database

In the first few days of the project, we began by setting up our database using SQLite due to our better understanding of the library. However, following some well-recieved feedback from our coach, the team then swiftly moved on to using PostgreSQL instead. This was, in part, to avoid any later complications that could have resulted by switching from SQLite to PostgreSQL.

In our database schema, we decided on using five tables:
- countries: to include the country names, their capital cities and flag url links
- users: to store user email, username and encrypted passwords
- sessions: to store cookies as uuids
- current_games: to keep track of any current games including user details, the countries played, current score, etc.
- finished_games: to store details of any finished games including user details, final score, etc.

### Countries data
When it came to the data for all of the countries and their capital cities, we decided to use the [countries-now-space](https://countriesnow.space) API. This API was chosen because it provided more commonly known colloquial names of the countries, instead of their strictly official names, which many English speaking users may not be aware of. 

One of the issues that the team had to address was whether to include all countries included in the API, such as Greenland, the Réunion island, etc. We decided to use the United Nations [member states](https://www.un.org/en/about-us/member-states) as a guide to deciding which countries to include. 

We also decided to change the name of a few countries to their more commonly-known or most-latest accepted names, i.e. North Macedonia (insead of Macedonia), or Palestine (instead of Palestinian Territory).

### Deployment

For our database, we used [ElephantSQL](https://www.elephantsql.com/) ...........

## Backend: How we set up our backend

We set up our backend in JavaScript (JS) using [Deno](https://deno.land), and specifically using Deno's [Abc](https://deno.land/x/abc@v1.3.1) framework.

We decided to simplify our main JS file for the backend by splitting up the functions for each endpoint into its own handler. We also took out certain helper functions into their own JS files.

For user authentication, we used a third party module, [BCrypt](https://deno.land/x/bcrypt/mod.ts), to handle the user password hashing and for checking the password. 

We used cookies in the backend for dealing with user authorisation, to keep track of currently logged in user, current games being played now, etc.

### Deployment

For our backend, we used [heroku](https://heroku.com/home) ...........

## Frontend: How we set up our frontend

For our frontend, we used the [React](https://reactjs.org) library and split our main App JS file into separate components to handle different pages, i.e. login, register, homepage, etc.

Some of the packages we used (for installation):
- React [Router](https://reactrouter.com/web/guides/quick-start): for handling the routing to the different pages
- Countdown [clock](https://www.npmjs.com/package/react-countdown-clock): for providing a visual animation to the time countdown during game play
- [Confetti](https://www.npmjs.com/package/react-dom-confetti) animations: for displaying a visual animation whenever the user correctly names a country or its capital city

### Deployment

For our frontend, we used [netlify](https://www.netlify.com) ...........

## Extra: What if we had more time?

- Implement user to user gaming experience (i.e. on one device)
- Implement online multiplayer gaming experience
- More bonus questions, i.e. naming neighbouring countries, official/main languages, population sizes, etc.
- Difficulty settings
- Anything else you can think of? Do let us know! :smiley:
