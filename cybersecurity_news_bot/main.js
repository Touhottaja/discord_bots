const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.on("ready", () => {
    console.log(`Bot "${client.user.tag}" ready`);
});

client.on("messageCreate", msg => {
    console.log(`Message from ${msg.author.tag}: ${msg.content}`);
    if (msg.content === "ping") {
        msg.reply("pong");
    }
});

client.login(process.env.DISCORD_TOKEN)
