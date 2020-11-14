const { EventEmitter } = require('events')

let emitter = new EventEmitter();
let channel;

emitter.on('newListener', async (event) => {
    if(event !== "messages") return;
    try {
        let lastId = channel.lastMessageID;
        let partialSize = 100;

        while(partialSize === 100) {
            let partialMessages = await channel.messages.fetch({limit: 100, before: lastId})
            lastId = partialMessages.last().id;
            partialSize = partialMessages.size;
            emitter.emit('messages', partialMessages.filter(message => message.content).map(message => message.content))
        }

        emitter.emit('end', 'end')
    } catch(e) {
        console.log('Skipped for error')
    }
})

module.exports.collectAll = (chan) => {
    channel = chan;
    return emitter;
}