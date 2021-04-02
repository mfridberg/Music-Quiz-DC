const ytdl = require('ytdl-core');
const axios = require('axios');

let _playlistId = undefined;
let _connection = undefined;

const startSong = (playlistID, connection) => {
    _playlistId = playlistID;
    _connection = connection;
    getRandomVideo(playlistID).then((playListItemID) =>{
        getMediaData(playListItemID).then((mediaData)=>{
            playSound(mediaData[2], connection);
            const re = /(?<=- ).+?(?= \(| \[|$| ft| featuring| remix| -)/
            let tempTitle = mediaData[1];
            let title = tempTitle.match(re)[0].toLowerCase()
            songTitle = title;
            console.log(`title: ${songTitle}`);
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
    const playListItemID = response.data.items[videoPageIndex].id;
    console.log(playListItemID);

    return playListItemID;
}

const getMediaData = async (playListItemID) => {
    const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&id=${playListItemID}&fields=items(snippet(videoOwnerChannelTitle%2C%20title%2C%20resourceId))&key=${process.env.YTTOKEN}`

    let mediaData;
    try {
        const response = await axios.get(url);
        const videoID = response.data.items[0].snippet.resourceId.videoId;
        const uploader = response.data.items[0].snippet.videoOwnerChannelTitle;
        const artist = uploader.substring(0, uploader.length-4);
        const songTitle = response.data.items[0].snippet.title;
        mediaData = [artist, songTitle, videoID];
    } catch(e) {
        console.log("ERROR: "+e)
    }
    return mediaData;
};

exports.startSong = startSong;
exports.skipSong = skipSong;