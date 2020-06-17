const { Client, Collection, MessageEmbed } = require('discord.js'),
    { readdirSync } = require("fs"),
    chalk = require("chalk"),
    koreanbots = require("koreanbots"),
    table = (new(require("ascii-table"))).setHeading("Command", "Status"),
    Bot = new koreanbots.MyBot('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTc0NDMxNjk0MzY5NTg5MiIsImlhdCI6MTU4OTc3MzQzMywiZXhwIjoxNjIxMzMxMDMzfQ.PNvx4nSp-YsRf0ys7GM4XXtkIMdjAaL9Y4zP8NG0vCRK5fFmNPjoehAFCmF-Breff2FuV7IKMtb2wtxxKIVE-yNFI1vgdBtn6xVvuRLs2xb8Q1j82TTqjbDCBIziBy3rpLWz0XOo6TWcW5rQuXPX6Bq-GgzMamuJ1p5SkClPvH4'),
    client = new Client(),
    ops = require('./ops');

client.login("NjY5NzQ0MzE2OTQzNjk1ODky.XugyyA.ZK1OaZhRJIA1JsZStGe3UjrojPU");

client.commands = new Collection();
client.aliases = new Collection();
client.cooltime = new Set();
client.categories = readdirSync("./commands/");

readdirSync("./commands/").forEach(dir => {
    for (let file of readdirSync(`./commands/${dir}`).filter(f => f.endsWith(".js"))) {
        let pull = require(`./commands/${dir}/${file}`);
    
        if (pull.name) {
            client.commands.set(pull.name, pull);
            table.addRow(file, "✅")
        } else {
            table.addRow(file, "❌")
        }
    
        if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(a => client.aliases.set(a, pull.name))
    }
});

client.on("ready", async function () {
    console.log(`${table.toString()}\nLogin ${client.user.username}\n----------------------------`);
    client.user.setActivity(`${ops.prefix[0]} 도움 | 나는 v2`)
    client.channels.cache.get('716912895010668605').send('해피트리봇v2가 온라인이 되었습니다!!')
    Bot.update(client.guilds.cache.size).then(e => console.log(e.code)).catch(e => console.error(e.message))
})
.on("message", async function (message) {
    let cdseond = 6000
    if (message.author.bot || message.system || !message.content.startsWith('^해피야')) return;

    try {
        client.channels.cache.get('722308092695674891').send(new MessageEmbed().setColor('GREEN').setTitle('명령어 사용!').setDescription(`**유저:${message.author.username}\n${message.author.id}\n서버:${message.guild.name}\n${message.guild.id}\n메시지 내용:${message.content}**`).setFooter(message.author.tag, message.author.avatarURL()))
        if (client.cooltime.has(message.author.id)) {
            setTimeout(() => {
                client.cooltime.delete(message.author.id)
            }, cdseond)
        }
        if (message.content == `^해피야`) return message.channel.send('왜');

        const args = message.content.slice(4).trim().split(/ +/g),
		    cmd = args.shift().toLowerCase(),
            command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        
        if (command) {
            command.run(client, message, args, ops)
        } else {
            return message.channel.send('아니.. 그게 무슨 명령어이길래 나한테 그렇게 말하는거야? 으이?').then(m => m.edit('**그게 뭐죠? 먹는 건가요?**'))
        }
    } catch (err) {
        client.channels.cache.get('716913808790126602').send(new MessageEmbed().setColor('RED').setTitle('에러...').setDescription(`**유저:${message.author.username}\n${message.author.id}\n서버:${message.guild.name}\n${message.guild.id}\n에러 내용:${err.message || err}**`).setFooter(message.author.tag, message.author.avatarURL()))
    }
})