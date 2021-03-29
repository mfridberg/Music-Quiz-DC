const fs = require('fs');
const dotenv = require('dotenv');
const Discord = require('discord.js');
const config = require('./config.json');
const { guesser } = require('./game-logic');
global.running = false;
global.songTitle;
dotenv.config();

global.client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log("Bot started!");
});

client.on('message', message => {
    if ((!message.content.startsWith(config.prefix) && !running) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    if (!client.commands.has(command) && !running) return;

	if (!client.commands.has(command)){
        if(message.channel.name === 'music-quiz') {
            guesser(message)
        } else {
            return;
        }
        return;
    }

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
})

client.login(process.env.TOKEN);