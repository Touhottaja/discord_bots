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

const NEWS_READ_CNT = 1; // How many news are read from the rss feed
const CHECK_NEWS_INTERVAL_MIN = 60 * 5 * 1000; // 5 mins
const MSG_DELETE_TIME_MIN = 60 * 60 * 12 * 1000; // 12 hours
const CLEAR_READ_NEWS_INTERVAL_MIN = 60 * 60 * 24 * 1000; // 24 hours
let channel;

client.on("ready", () => {
    console.log(`[News Bot] Bot "${client.user.tag}" ready`);
    
    channel = client.channels.cache.find(ch => ch.name === "general");

    // Read news when the bot is started
    for (let feed_name in feeds) {
        read_news(feed_name, feeds[feed_name]);
    }
});

client.on("messageCreate", msg => {
    console.log(`[News Bot] Message from ${msg.author.tag}: ${msg.content}`);
    switch (msg.content.toLowerCase()) {
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

    // Read the latest news
    let news = feed.items.slice(0, NEWS_READ_CNT);

    // Parse titles and links
    news = news.map(item => `${item.title}: ${item.link}`);

    // Remove already read news
    news = news.filter(item => !feed_dict.read_news.includes(item));

    // Send news to the channel
    if (news.length > 0) {
        channel.send(news.join("\n"))
            .then(msg => setTimeout(() => msg.delete(), MSG_DELETE_TIME_MIN));
    } else {
        console.log(`[News Bot] No news from ${feed_name}`);
    }

    // Update the read news
    feed_dict.read_news = feed_dict.read_news.concat(news);
}

// Login the bot
client.login(process.env.DISCORD_TOKEN)

// Read news every 60 minutes
setInterval(() => {
    for (let feed_name in feeds) {
        read_news(feed_name, feeds[feed_name]);
    }
}, CHECK_NEWS_INTERVAL_MIN);

// Clear read news every 24 hours
setInterval(() => {
    for (let feed_name in feeds) {
        feeds[feed_name].read_news = [];
     }
}, CLEAR_READ_NEWS_INTERVAL_MIN);

