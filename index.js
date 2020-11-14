const Discord = require('discord.js')
const fs = require('fs');
const client = new Discord.Client()

const { collectAll } = require('./util.js')
const { token, guild } = require('./config.json')

client.once('ready', async () => {
    let channels = client.guilds.cache.get(guild).channels.cache.filter(channel => channel.type === "text").array();
    for(channel of channels) {
        let collector = collectAll(channel);
        await new Promise((resolve, reject) => {
            collector.on('messages', (messages) => {
                fs.appendFileSync('messages.txt', messages.join('\n') + '\n')
            })
            collector.on('end', () => {
                collector.removeAllListeners('messages')
                collector.removeAllListeners('end')
                resolve();
            })
        })
        console.log('loop complete')
    }
})

client.login(token)
