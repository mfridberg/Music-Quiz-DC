const guesser = (message) => {
    const guess = message.content.strip().toLower();
    const caller = message.author;
    const matchRatio = checkSimilarities(guess, songName);
    if(matchRatio > 0.79){
        //give points to caller
        //next song
    }
    else{
        //reagera meddelande typ bajs eller nått
    }
}

const checkSimilarities = (guess, songName) => {
    return stringSimilarity.compareTwoStrings(guess, songName);
}

exports.guesser = guesser;