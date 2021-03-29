const { MessageEmbed } = require('discord.js');
const songHandler = require('../song-handler')

module.exports = {
    name: 'start',
    description: 'Start a round of Music Quiz',
    execute(message, args) {
        running = true;
        if(message.member.voice.channel) {
            const connection = message.member.voice.channel.join()
                .then(connection => {
                    startMessage(message);
                    const playlistID = args[0];
                    songHandler.startSong(playlistID, connection)
                });
        }
    },
};

const startMessage = (m) => {
    const e = new MessageEmbed();
    e.setColor(0xF0FFFF);
    e.setTitle(':musical_note: Music Quiz! :musical_note:');
    e.setDescription('Welcome to this round of Music Quiz!\n Please select genre!');
    m.channel.send(e);
};
