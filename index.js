const fs = require('fs');
const dotenv = require('dotenv');
const Discord = require('discord.js');
const config = require('./config.json');
const stringSimilarity = require('string-similarity');
dotenv.config();

global.client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) {
        // TODO: Add logic for comparing to current song
        const similarities = checkSimilarities(message.content, "hej");
        return;
    };

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
})

// Maybe move this to another file
const checkSimilarities = (guess, songName) => {
    return stringSimilarity.compareTwoStrings(guess, songName);
}

client.login(process.env.TOKEN);