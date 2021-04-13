const { playSoundEffect } = require('../sound-effects');

module.exports = {
    name: 'fart',
    description: 'Play fart sound',
    execute(message, args) {
        const farts = [
            'https://www.youtube.com/watch?v=sOK8vaaJKxQ',
            'https://www.youtube.com/watch?v=WSjJJAkDLMg',
            'https://www.youtube.com/watch?v=RgeH1wFZAmc',
            'https://www.youtube.com/watch?v=dEOjOkHSShM',
            'https://www.youtube.com/watch?v=W_OPxYw8yQw',
            'https://www.youtube.com/watch?v=cWHRB98McEc'
        ]
        const fart = farts[Math.floor(Math.random() * farts.length)];
        playSoundEffect(message, fart)
    },
};