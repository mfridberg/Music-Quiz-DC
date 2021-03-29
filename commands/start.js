const { MessageEmbed } = require('discord.js');
const songHandler = require('../song-handler');

module.exports = {
    name: 'start',
    description: 'Start a round of Music Quiz',
    execute(message, args) {
        running = true;
        if(message.member.voice.channel) {
            message.member.voice.channel.join()
                .then(connection => {
                    startMessage(message);
                    const playlistID = args[0];
                    songHandler.startSong(playlistID, connection);
                });
        }
    },
};

const startMessage = (m) => {
    const e = new MessageEmbed();
    e.setColor(0xF0FFFF);
    e.setTitle(':musical_note: Music Quiz! :musical_note:');
    e.setDescription('Welcome to this round of Music Quiz!\n Rules: You only need to guess the name (and not even 100% accurately, how convenient!)');
    m.channel.send(e);
};
