const Discord = require('discord.js');
const client = new Discord.Client();
var config = require('./config.json');
const fs = require('fs');


client.on("ready", async () => {
    require('./custom-events/blackmessage').execute(client);
    client.commands = new Discord.Collection();

    for (const file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
    console.log('[Logs] Bot Online!')
  })
  client.on("message", async (message) => require('./custom-events/message').execute(message, client));


  client.login(config["token"])