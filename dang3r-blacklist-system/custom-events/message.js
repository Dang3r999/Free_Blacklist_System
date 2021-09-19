const discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
    /**
     * 
     * @param {discord.Message} message 
     * @param {discord.Client} client 
     */
    async execute(message, client) {

        if (!message.content.startsWith(config["prefix"]) || message.author.bot) return;
        
        const args = message.content.slice(1).trim().split(' ');
        const command = args.shift().toLowerCase();

        if (!client.commands.has(command)) return;
        client.commands.get(`${command}`).execute(message, args, client).catch(error => {
            console.log(error)
        })
    },
};