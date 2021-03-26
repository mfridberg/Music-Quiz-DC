const ytdl = require('ytdl-core');

module.exports = {
    name: 'start',
    description: 'Start a round of Music Quiz',
    execute(message, args) {
        if(message.member.voice.channel) {
            const connection = message.member.voice.channel.join()
                .then(connection => {
                    //Change the link to be dynamic somehow!!
                    const stream = ytdl("https://www.youtube.com/watch?v=Ko1wKjuXCKI", {filter: 'audioonly'});
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