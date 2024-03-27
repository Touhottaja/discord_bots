# News Bot
Discord bot for fetching (cybersecurity) news from multiple sources.

## Set up
### Environment
1. Install Node.js: [instructions](https://nodejs.org/en/download/package-manager)
2. Create `.env` file, see `.env.example` for contents
3. Install packages:
```sh
$ npm install discord.js rss-parser
```

### Running the bot
Run the bot via:
```sh
$ node --env-file=.env main.js
```

If you want to run the bot as a service (e.g., on Raspberry Pi), replace the placeholders in `news_bot.service` and move/copy it to `/etc/systemd/system/`. Run the service with:
```sh
$ sudo systemctl daemon-reload
$ sudo systemctl start news_bot
$ sudo systemctl enable news_bot
```

### Adding/removing news feeds
You can add and remove rss feeds using the `feeds` dictionary in `main.js`.

### Discord configuration
See the first steps from [Discord's developers guide](https://discord.com/developers/docs/quick-start/getting-started).
