const { MessageEmbed } = require('discord.js');
const songHandler = require('../song-handler');

module.exports = {
    name: 'skip',
    description: 'Skip song',
    execute(message, args) {
        skipMessage(message)
        songHandler.skipSong();
    }
}

const skipMessage = (m) => {
    const e = new MessageEmbed();
    e.setColor(0xF0FFFF);
    e.setTitle(':musical_note: Music Quiz! :musical_note:');
    e.setDescription(`The song was ${songTitle} you absolute noobs!!`);
    m.channel.send(e);
};