const ytdl = require('ytdl-core');
const axios = require('axios');

let _playlistId = undefined;
let _connection = undefined;

const startSong = (playlistID, connection) => {
    _playlistId = playlistID;
    _connection = connection;
    getRandomVideo(playlistID).then((videoID) =>{
        getMediaData(videoID).then((mediaData)=>{
            playSound(mediaData[2], connection);
            const re = /(?<=- ).+?(?= \(| \[)/
            let tempTitle = mediaData[1];
            let title = tempTitle.match(re)[0].toLowerCase()
            songTitle = title;
            console.log(`artist: ${mediaData[0]} and title: ${songTitle}`);
        })
    });
}

const skipSong = () => {
    startSong(_playlistId, _connection);
}

const playSound = async (videoID, connection) => {
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

const getRandomVideo = async (playlistID) => {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistID}&key=${process.env.YTTOKEN}`;
    let response;
    try {
        response = await axios.get(url)
    } catch(e) {
        console.log(e)
    }

    const max = response.data.pageInfo.totalResults;
    const index = Math.floor(Math.random() * parseInt(max));

    const page = Math.floor(index / 50);
    let pageToken;
    if (response.data.nextPageToken != undefined) {
        pageToken = response.data.nextPageToken;
    }

    for (let i = 0; i < page; i++) {
        const nextPageUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&pageToken=${pageToken}&playlistId=${playlistID}&key=${process.env.YTTOKEN}`;
        try {
            response = await axios.get(nextPageUrl);
        } catch(e) {
            console.log(e);
        }
        if(response.data.nextPageToken != undefined) {
            pageToken = response.data.nextPageToken;
        }
    }
    const videoPageIndex = index % 50;
    const videoID = response.data.items[videoPageIndex].id;

    return videoID;
}

const getMediaData = async (videoURL) => {
    const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&id=${videoURL}&fields=items(snippet(videoOwnerChannelTitle%2C%20title%2C%20resourceId))&key=${process.env.YTTOKEN}`
    let response;

    try {
        response = await axios.get(url)
    } catch(e) {
        console.log(e)
    }

    const videoID = response.data.items[0].snippet.resourceId.videoId;
    const uploader = response.data.items[0].snippet.videoOwnerChannelTitle;
    const artist = uploader.substring(0, uploader.length-4);
    const songTitle = response.data.items[0].snippet.title;
    const mediaData = [artist, songTitle, videoID];
    return mediaData;
};

exports.startSong = startSong;
exports.skipSong = skipSong;