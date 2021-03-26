const Discord = require('discord.js');
const dotenv = require('dotenv');

const client = new Discord.Client();
dotenv.config();

client.once('ready', () => {
    console.log('Game on!')
});

client.login(process.env.TOKEN);