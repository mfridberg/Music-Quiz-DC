const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');

module.exports = {
    name: 'start',
    description: 'Start a round of Music Quiz',
    execute(message, args) {
        if(message.member.voice.channel) {
            const connection = message.member.voice.channel.join()
                .then(connection => {
                    startMessage(message)
                    const stream = ytdl('https://www.youtube.com/watch?v=SpgVlTJibc0', {filter: 'audioonly'});
                    const dispatcher = connection.play(stream);

                    dispatcher.on('start', () => {
                        console.log('Audio is now playing!');
                    });

                    dispatcher.on('finish', () => {
                        console.log('Audio has finished playing!');
                    });

                    dispatcher.on('error', console.error);
                })
        }
    }
}

const startMessage = (m) => {
    var e = new MessageEmbed();
    e.setColor(0xF0FFFF);
    e.setTitle(':musical_note: Music Quiz! :musical_note:');
    e.setDescription('Welcome to this round of Music Quiz!\n Please select genre!');
    m.channel.send(e)
}
