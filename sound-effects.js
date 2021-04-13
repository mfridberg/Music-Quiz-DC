const ytdl = require('ytdl-core');

const playSoundEffect = (message, sound) => {
    if(message.member.voice.channel) {
        message.member.voice.channel.join()
            .then(connection => {    
                const stream = ytdl(sound, {filter: 'audioonly'});
                const dispatcher = connection.play(stream);
            
                dispatcher.on('start', () => {
                    console.log('Audio is now playing!');
                });
            
                dispatcher.on('finish', () => {
                    // message.member.voice.channel.leave();
                    dispatcher.destroy();
                    console.log('Audio has finished playing!');
                });
            
                dispatcher.on('error', console.error);
                
            });
    }
};

exports.playSoundEffect = playSoundEffect;