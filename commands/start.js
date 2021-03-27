const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const axios = require('axios').default;

module.exports = {
    name: 'start',
    description: 'Start a round of Music Quiz',
    execute(message, args) {
        if(message.member.voice.channel) {
            const connection = message.member.voice.channel.join()
                .then(connection => {
                    startMessage(message);
                    const playlistID = args[0];
                    const [artist, title, videoId] = getID(playlistID);
                    playSound(videoId);
                    //rätt gissning byt låt
                });
        }
    },
};

async function playSound(videoID){
    try{
        videoID = 
    }
    catch(e){}

    const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, {filter: 'audioonly'});
    const dispatcher = connection.play(stream);

    dispatcher.on('start', () => {
        console.log('Audio is now playing!');
    });

    dispatcher.on('finish', () => {
        console.log('Audio has finished playing!');
    });

    dispatcher.on('error', console.error);
}

async function getRandomVideo(playlistID) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistID}&key=${process.env.YTTOKEN}`;
    let response;
    try{response = await axios.get(url)}
    catch(e) {console.log(e)}

    const max = response.data.pageInfo.totalResults;
    const index = Math.floor(Math.random() * parseInt(max));

    const page = Math.floor(index / 50);
    let pageToken;
    if (response.data.nextPageToken != undefined) {
        pageToken = response.data.nextPageToken;
    }

    for (let i = 0; i < page; i++) {
        const nextPageUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&pageToken=${pageToken}&playlistId=${playlistID}&key=${process.env.YTTOKEN}`;
        try{response = await axios.get(nextPageUrl);}
        catch(e) {console.log(e);}
        if(response.data.nextPageToken != undefined) {
            pageToken = response.data.nextPageToken;
        }
    }
    const videoPageIndex = index % 50;
    const videoID = response.data.items[videoPageIndex].id;

    return videoID;
}

const getID = async (playlistURL) => {
    let videoURL;
    try {
        videoURL = await getRandomVideo(playlistURL);
    }
    catch(e) {
        console.log(e);
    }
    const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&id=${videoURL}&fields=items(snippet(videoOwnerChannelTitle%2C%20title%2C%20resourceId))&key=${process.env.YTTOKEN}`
    
    let response;

    try{response = await axios.get(url)}
    catch(e){console.log(e)}

    const videoID = response.data.items[0].snippet.resourceId.videoId;
    const uploader = response.data.items[0].snippet.videoOwnerChannelTitle;
    const artist = uploader.substring(0, uploader.length-4);
    const songTitle = response.data.items[0].snippet.title;
    return (artist, songTitle, videoID);
};

const startMessage = (m) => {
    const e = new MessageEmbed();
    e.setColor(0xF0FFFF);
    e.setTitle(':musical_note: Music Quiz! :musical_note:');
    e.setDescription('Welcome to this round of Music Quiz!\n Please select genre!');
    m.channel.send(e);
};
