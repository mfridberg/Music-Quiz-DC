const stringSimilarity = require('string-similarity');
const { skipSong } = require('./song-handler');

const guesser = (message) => {
    const guess = message.content.toLowerCase().trim();
    if(checkSimilarities(guess, songTitle) > 0.79) {
        message.react('🥳');
        // give points to caller
        const players = new Map();

        if (!players.has(message.author.id)) {
            players.set(message.author.id, 1);
        }
        else {
            players.get(message.author.id).val++;
        }

        skipSong();
    }
    else {
        message.react('💩');
    }
};

const checkSimilarities = (guess, songName) => {
    return stringSimilarity.compareTwoStrings(guess, songName);
};

exports.guesser = guesser;