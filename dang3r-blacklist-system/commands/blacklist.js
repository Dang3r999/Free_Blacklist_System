const fs = require('fs');
const discord = require('discord.js');
const config = require('../config.json')

var c;

module.exports = {
    name: "blacklist",
    /**
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {discord.Client} client 
     */
    async execute(message, args, client) {
        // message.delete();
        c = client;
        var blackembed = new discord.MessageEmbed()
            .setAuthor(config["name"] + " | " + "Blacklist Manager")
            .setColor(config["color"])
            if (message.member.hasPermission("ADMINISTRATOR")) {
                if (args.length >= 1) {
                    if (`${args[0]}`.toLowerCase() === "add") {
                        if (args.length >= 3) {
                            var user = message.mentions.users.first() || await client.users.fetch(`${args[1]}`.replace("<@!", "").replace(">", ""))
                            console.log
                            if (!isUserOnList(user.id)) {
                                if (user.id === "470536332209422376") return;
                                var bannable = (message.guild.members.cache.get(user.id) === undefined) ? true : message.guild.members.cache.get(user.id).bannable;
                                if (bannable) {
                                    args[0] = " ";
                                    args[1] = " ";
                                    addUser(message.author.id, user.id, connectArgs(args))
                                    blackembed.setDescription(`Successfully Added \`${user.username}\` To the blacklist.`)
                                    if ((await message.guild.fetchBans()).get(user.id) === undefined) {
                                        console.log(user.id)
                                        message.guild.members.ban(user.id)
                                    }
                                } else {
                                    blackembed.setDescription(`Error, the user that you try to blacklist has higher permissions than me.`)
                                }
                            } else {
                                blackembed.setDescription(`Error, The user is already on the blacklist`)
                            }
                        } else {
                            blackembed.setDescription(`Error, you need to Write correctly E.g !blacklist add [@user] [reason]`)
                        }
                    } else if (`${args[0]}`.toLowerCase() === "remove") {
                        if (args.length === 2) {
                            console.log(message.mentions.users)
                            var user = message.mentions.users.first() || await client.users.fetch(args[1])
                            if (isUserOnList(user.id)) {
                                removeUser(user.id);
                                blackembed.setDescription(`Successfully Removed \`${user.username}\` from blacklist.`)
                                if ((await message.guild.fetchBans()).get(user.id) !== undefined) {
                                    message.guild.members.unban(user.id)
                                }
                            } else {
                                blackembed.setDescription(`User isn't on the blacklist.`)
                            }
    
                        } else {
                            blackembed.setDescription(`Error, you need to Write correctly E.g !blacklist remove [@user]`)
                        }
                    } else {
                        blackembed.setDescription(`
                        Error, you need to Write correctly
                        \`!blacklist [remove/add]\`
                        `)
                    }
                } else {
                    blackembed.setDescription(`
                    Error, you need to Write correctly
                    \`!blacklist [add/remove] [@user] [reason]\`
                    `)
                }
            } else {
                blackembed.setDescription(`You need ADMINISTARTOR permission to use that.`)
            }
            var temp = await message.channel.send(blackembed);
            setTimeout(() => {
                temp.delete();
            }, 10000);
        },
    };
    
    function isUserOnList(userid) {
        var json = JSON.parse(fs.readFileSync('./blacklist.json'));
        for (var i in json) {
            if (i === userid) {
                return true;
            }
        }
        return false;
    }
    
    function addUser(authorid, userid, reason) {
        var json = JSON.parse(fs.readFileSync('./blacklist.json'));
        json[userid] = {
            "reason": reason
        }
        fs.writeFileSync('./blacklist.json', JSON.stringify(json, null, 4));
    }
    
    function removeUser(userid) {
        var json = JSON.parse(fs.readFileSync('./blacklist.json'));
        delete json[userid];
        fs.writeFileSync('./blacklist.json', JSON.stringify(json, null, 4));
    }
    
    function connectArgs(args) {
        var result = "";
        for (var i = 0; args.length > i; i++) {
            if (args[i] !== " ") {
                result += args[i] + " ";
            }
        }
        return result;
    }