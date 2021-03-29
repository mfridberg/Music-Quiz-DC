const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const axios = require('axios').default;

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
                    getRandomVideo(playlistID).then((videoID) =>{
                        getMediaData(videoID).then((mediaData)=>{
                            playSound(mediaData[2], connection);
                            const titleFormat = /(?<=- ).+?(?= \()/;
                            let tempTitle = mediaData[1];
                            tempTitle = tempTitle.includes("(") 
                                ? tempTitle.split("-")[1].split("(")[0].replace(/ /g,"").replace("'", "").toLowerCase()
                                : tempTitle.split("-")[1].replace(/ /g,"").replace("'", "").toLowerCase();
                            songTitle = tempTitle;
                            console.log(`artist: ${mediaData[0]} and title: ${songTitle}`);
                        })
                    });
                });
        }
    },
};

async function playSound(videoID, connection){
    const stream = ytdl(`https://www.youtube.com/watch?v=${videoID}`, {filter: 'audioonly'});
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

async function getMediaData (videoURL) {
    const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&id=${videoURL}&fields=items(snippet(videoOwnerChannelTitle%2C%20title%2C%20resourceId))&key=${process.env.YTTOKEN}`
    
    let response;

    try{response = await axios.get(url)}
    catch(e){console.log(e)}

    const videoID = response.data.items[0].snippet.resourceId.videoId;
    const uploader = response.data.items[0].snippet.videoOwnerChannelTitle;
    const artist = uploader.substring(0, uploader.length-4);
    const songTitle = response.data.items[0].snippet.title;
    const mediaData = [artist, songTitle, videoID];
    return mediaData;
};

const startMessage = (m) => {
    const e = new MessageEmbed();
    e.setColor(0xF0FFFF);
    e.setTitle(':musical_note: Music Quiz! :musical_note:');
    e.setDescription('Welcome to this round of Music Quiz!\n Please select genre!');
    m.channel.send(e);
};
