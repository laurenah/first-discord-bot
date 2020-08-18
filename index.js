const Discord = require("discord.js");
const fetch = require('node-fetch');
// create a token.js file and use module.exports.token = 'YOUR_TOKEN_HERE'
const config = require('./token.js');

const bot = new Discord.Client();

bot.on('ready', () => {
  console.log('bot is ready');
});

const prefix = '!'
bot.on('message', async (msg) => {
    if (msg.content[0] !== prefix) { // if no prefix, ignore the message
        return;
    }

    const args = msg.content.slice(prefix.length).trim().split(' '); // gather arguments split by spaces
    const cmd = args.shift().toLowerCase(); // get the command

    // lil self confidence boost my dude
    if (cmd === 'hype') {
        msg.react('😤'); // have to use unicode in react, but can do :triumph: in replies
        msg.reply("you're the best my dude");
    }

    // ping command
    if (cmd === 'ping') {
        msg.channel.send('*rips bong*');
    }

    // deletes the command message plus a specified (default 2) num of messages previous
    if (cmd === 'clear') {
        const user = msg.mentions.users.first();
        const amount = !!parseInt(msg.content.split(' ')[1]) ? parseInt(msg.content.split(' ')[1]) : parseInt(msg.content.split(' ')[2])
        if (!amount) {
            return msg.reply('you forgot to specify an amount to clear!');
        }
        if (!amount && !user) {
            return msg.reply('you forgot to specify a user and an amount, or just an amount');
        }

        msg.channel.messages.fetch({
            limit: 100
        }).then((messages) => {
            if (user) {
                const filter = user ? user.id : bot.user.id;
                messages = messages.filter(m => m.author.id === filter);
            }
            messages = messages.array().slice(0, amount);
            msg.channel.bulkDelete(messages).catch(error => console.log(error.stack)).then(() => {
                msg.channel.send(`cleared ${messages.length} messages`).then(message => message.delete({
                    timeout: 3000
                }))
            });
        });
    }

    if (cmd === 'joke') {
        let jokeFetch = async() => {
            let result = await fetch('https://official-joke-api.appspot.com/random_joke')
            let json = await result.json()
            return json
        }

        let joke = await jokeFetch()
        msg.channel.send(`
        ${joke.setup}
        ${joke.punchline}
        `)
    }
});

bot.login(config.token);