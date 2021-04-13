const { playSoundEffect } = require('../sound-effects');

module.exports = {
    name: 'sheesh',
    description: 'Sheeesh',
    execute(message, args) {
        playSoundEffect(message, 'https://www.youtube.com/watch?v=YgT6XABqS5Y')
    },
};