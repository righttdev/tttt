const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const reasons = {
    "1": `Your bot was offline when we tried to verify it.`,
    "2": `Your bot is a clone of another bot`,
    "3": `Your bot responds to other bots`,
    "4": `Your bot doesn't have any/enough working commands. (Minimum: 7)`,
    "5": `Your bot has NSFW commands that work in non-NSFW marked channels`,
    "6": `Your bot doesn't have a working help command or commands list`
}
var modLog;

Array.prototype.remove = function() {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
}

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'remove',
            runIn: ['text'],
            aliases: ["delete"],
            permissionLevel: 8,
            botPerms: ["SEND_MESSAGES"],
            description: "Remove a bot from the botlist",
            usage: '[Member:user]'
        });
    }

    async run(message, [Member]) {
        if (!Member || !Member.bot) return message.channel.send(`You didn't ping a bot to remove.`)
        let e = new MessageEmbed()
            .setTitle('Reasons')
            .setColor(0x6b83aa)
            .addField(`Removing bot`, `${Member}`)
        let cont = ``;
        for (let k in reasons) {
            let r = reasons[k];
            cont += ` - **${k}**: ${r}\n`
        }
        cont += `\nEnter a valid reason number or your own reason.`
        e.setDescription(cont)
        message.channel.send(e);
        let filter = m => m.author.id === message.author.id;

        let collected = await message.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ['time'] });
        let reason = collected.first().content
        let r = collected.first().content;
        if (parseInt(reason)) {
            r = reasons[reason]
            if (!r) return message.channel.send("Inavlid reason number.")
        }

        let res = JSON.parse(message.client.settings.get('bots')).find(u => u.id === Member.id);

        let updated = JSON.parse(message.client.settings.get('bots'));
        updated.find(u => u.id === Member.id).state = "deleted";
        message.client.settings.update("bots", JSON.stringify(updated));

        if (res === false) return message.channel.send(`Unknown Error. Bot not found.`)
        e = new MessageEmbed()
            .setTitle('Bot Removed')
            .addField(`Bot`, `<@${res.id}>`, true)
            .addField(`Owner`, `<@${res.owners[0]}>`, true)
            .addField("Mod", message.author, true)
            .addField("Reason", r)
            .setThumbnail(res.logo)
            .setTimestamp()
            .setColor(0xffaa00)
        modLog.send(e)
        modLog.send(`<@${res.owners[0]}>`).then(m => { m.delete() })
        message.channel.send(`Removed <@${res.id}> Check <#${process.env.MOD_LOG_ID}>.`)

        if (!message.client.users.cache.find(u => u.id === res.id).bot) return;
        try {
            message.guild.members.fetch(message.client.users.cache.find(u => u.id === res.id))
                .then(bot => {
                    bot.kick().then(() => {})
                        .catch(e => { console.log(e) })
                }).catch(e => { console.log(e) });
        } catch (e) { console.log(e) }
    }

    async init() {
        modLog = this.client.channels.cache.get(process.env.MOD_LOG_ID);
    }
};