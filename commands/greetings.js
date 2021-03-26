module.exports = {
    name: 'greetings',
    description: 'A simple greeting',
    execute(message, args) {
        message.channel.send('Greetings!');
        console.log('Greetings executed!');
    }
}