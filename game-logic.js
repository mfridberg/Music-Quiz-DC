const stringSimilarity = require('string-similarity');
const { MessageEmbed } = require('discord.js');
const { skipSong } = require('./song-handler');
const players = new Map();
let round = 1;

const guesser = (message) => {
    const guess = message.content.toLowerCase().trim();
    if(checkSimilarities(guess, songTitle) > 0.79) {
        message.react('🥳');

        if (!players.has(message.author.id)) {
            players.set(message.author.id, { val: 1, name: message.author.username });
        }
        else {
            players.get(message.author.id).val++;
        }
        if (round % 5 == 0) {
            const playerSorted = new Map([...players.entries()].sort((a, b) => b[1].val - a[1].val));
            // Detta är inte rätt, men man kan ej ta index från map
            playerSorted.get(message.author.id).name += ' 👑';
            const e = new MessageEmbed();
            e.setColor(0xF0FFFF);
            e.setTitle(':musical_note: Music Quiz! :musical_note:');
            let pointString = '';
            playerSorted.forEach(player => {
                pointString += `${player.name} has ${player.val} points \n`;
             });
            e.setDescription(`Current leaderboard: \n ${pointString}`);
            message.channel.send(e);
        }
        round++;
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