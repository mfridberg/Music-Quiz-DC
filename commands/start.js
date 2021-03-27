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
                    startMessage(message)
                    const url = args[0];
                    const playListUrl = args[0];
                    const videoId = getRandomVideo(playListUrl);
                    // const videoId = "UEw2WkxjLXpaVW54bGtCOXQ4Q2NwRlplVjZWNUlfY1ZndS5EQkE3RTJCQTJEQkFBQTcz";
                    const artistSongTitle = getId(videoId);
                    // console.log(artistSongTitle);
                    // const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, {filter: 'audioonly'});
                    // const dispatcher = connection.play(stream);

                    // dispatcher.on('start', () => {
                    //     console.log('Audio is now playing!');
                    // });

                    // dispatcher.on('finish', () => {
                    //     console.log('Audio has finished playing!');
                    // });

                    // dispatcher.on('error', console.error);
                })
        }
    }
}

async function getRandomVideo(playListUrl){
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playListUrl}&key=${process.env.YTTOKEN}`;
    let response;
    try{response = await axios.get(url)}
    catch(e){console.log(e)}

    const max = response.data.pageInfo.totalResults;
    const min = 0;
    const index = Math.floor(Math.random() * parseInt(max));
    console.log(index);

    const page = Math.floor(index/50);
    let pageToken;
    if(response.nextPageToken != undefined){
        pageToken = response.data.nextPageToken;
    }

    console.log(pageToken);
    for(i = 0; i < page; i++){
        const nextPageUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&pageToken=${pageToken}&playlistId=${playListUrl}&key=${process.env.YTTOKEN}`;
        try{response = await axios.get(nextPageUrl)}
        catch(e){console.log(e)}
        if(response.nextPageToken != undefined){
            pageToken = response.nextPageToken;
        }
    }
    const videoPageIndex = index%50;
    const videoId = response.data.items[videoPageIndex].id;
    console.log(videoId);

    return videoId;
}

async function getId(vidUrl){
    const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&id=${vidUrl}&fields=items(snippet(channelId%2C%20title))&key=${process.env.YTTOKEN}`
    
    let response;

    try{response = await axios.get(url)}
    catch(e){console.log(e)}

    const channelId = response.data.items[0].snippet.channelId;
    const songTitle = response.data.items[0].snippet.title;
    console.log("channelID: "+channelId)
    console.log("songTitle: "+songTitle)

    const url2 = `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&key=${process.env.YTTOKEN}&part=snippet`;

    try{response2 = await axios.get(url2)}
    catch(e){console.log(e)}

    const channelTitle = response2.data.items[0].snippet.title;

    const artist = channelTitle.substring(0, channelTitle.length-4);
    console.log("artist: "+artist)

    return (artist, songTitle);
}

const startMessage = (m) => {
    var e = new MessageEmbed();
    e.setColor(0xF0FFFF);
    e.setTitle(':musical_note: Music Quiz! :musical_note:');
    e.setDescription('Welcome to this round of Music Quiz!\n Please select genre!');
    m.channel.send(e)
}
