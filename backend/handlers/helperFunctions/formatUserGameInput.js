export default function formatUserGameInput(userInput) {
    // hard codes capitalisation for all inputs, accounting for those with 'of', 'the' and 'and' (all edge cases)
    userInput = userInput.toLowerCase()
    userInput = userInput.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    userInput = userInput.split('').filter(elem => alphabet.includes(elem) || elem === '-' || elem === ' ').join('')
    userInput = userInput.trim()
    const nonCapitalizedWords = ['and', 'of', 'the', 'au', 'la']
    userInput = userInput.split(' ').map(word => nonCapitalizedWords.includes(word) ? word : word[0].toUpperCase() + word.slice(1)).join(' ')
    userInput = userInput.split('-').map(word => nonCapitalizedWords.includes(word) ? word : word[0].toUpperCase() + word.slice(1)).join('-')
    return userInput
}
