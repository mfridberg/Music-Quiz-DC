const stringSimilarity = require('string-similarity');
const { skipSong } = require('./song-handler');

const guesser = (message) => {
    const guess = message.content.toLowerCase().trim();
    const caller = message.author;
    const matchRatio = checkSimilarities(guess, songTitle);
    if(matchRatio > 0.79){
        message.react('🥳');
        //give points to caller
        skipSong();
    } else {
        message.react('💩');
    }
}

const checkSimilarities = (guess, songName) => {
    return stringSimilarity.compareTwoStrings(guess, songName);
}

exports.guesser = guesser;