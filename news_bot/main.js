const { Client, GatewayIntentBits } = require("discord.js");
const RssParser = require("rss-parser");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
const rssParser = new RssParser();

const readIntervalMin = 60 // 1 hour
const clearReadNewsIntervalMin = 24 * 60 // 1 day
const feeds = {
    "Bleeping Computer": {
        "url": "https://www.bleepingcomputer.com/feed/",
        "read_news": [],
    },
    "The Hacker News": {
        "url": "https://feeds.feedburner.com/TheHackersNews",
        "read_news": [],
    }
}

client.on("ready", () => {
    console.log(`Bot "${client.user.tag}" ready`);
    // Read news when the bot is started
    for (let feed_name in feeds) {
        read_news(feed_name, feeds[feed_name]);
    }
});

client.on("messageCreate", msg => {
    console.log(`Message from ${msg.author.tag}: ${msg.content}`);
    switch (msg.content) {
        case "ping":
            msg.reply("pong");
            break;
        case "news":
            for (let feed_name in feeds) {
                read_news(feed_name, feeds[feed_name]);
            }
            break;
    }
});

async function read_news(feed_name, feed_dict) {
    // Read the feed
    let feed = await rssParser.parseURL(feed_dict.url);

    // Read the latest 5 news
    let news = feed.items.slice(0, 5);

    // Parse titles and links
    news = news.map(item => `${item.title}: ${item.link}`);

    // Remove already read news
    news = news.filter(item => !feed_dict.read_news.includes(item));

    // Send news to the channel
    let channel = client.channels.cache.find(ch => ch.name === 'general');
    if (news.length > 0) {
        channel.send(news.join("\n"));
    } else {
        channel.send(`${feed_name}: No new news.`);
    }

    // Update the read news
    feed_dict.read_news = feed_dict.read_news.concat(news);
}

// Login the bot
client.login(process.env.DISCORD_TOKEN)

// Read news every 60 minutes
setInterval(() => {
    for (let feed_name in Feeds) {
        read_news(feed_name, Feeds[feed_name]);
    }
}, readIntervalMin * 60 * 1000);

// Clear read news every 24 hours
setInterval(() => {
    for (let feed_name in Feeds) {
        Feeds[feed_name].read_news = [];
    }
}, clearReadNewsIntervalMin * 60 * 1000);
