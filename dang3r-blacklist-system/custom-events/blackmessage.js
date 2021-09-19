const discord = require('discord.js');
const fs = require('fs');
const { get } = require('http');
const config = require('../config.json');

var client;
var message;

module.exports = {
	async execute(c) {
        client = c;
        var channel = client.channels.cache.get(config["channelid"]);
        message = (await channel.messages.fetch({limit: 10})).filter(m => m.id === config["messageid"]);
        await updateMessage();
    },
};

async function updateMessage() {
    var list = await getList();
    let guild = client.guilds.cache.get(config["guildid"])
    var embed = new discord.MessageEmbed()
      .setTitle(config["name"] + " | " + "BlackListed Members")
      .setThumbnail(guild.iconURL({ dynamic: true}))
      .setColor(config["color"])
      .setDescription(`${list.length > 0 ? await list : "The list is currently empty."}`)
      .setTimestamp()
      .setFooter("Coded By Dang3r.#3553");
    message.first().edit(embed);
    setTimeout(updateMessage, 10000)
}

async function getList() {
    var result = "";
    var json = JSON.parse(fs.readFileSync('./blacklist.json'));
    for (var i in json) {
        result += `\`${(await client.users.fetch(i)).tag} (${i}) - ${json[i].reason}\`\n`;
    }
    return result;
  }