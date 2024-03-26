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

### Adding/removing news feeds
You can add and remove rss feeds using the `feeds` dictionary in `main.js`.

### Discord configuration
See the first steps from [Discord's developers guide](https://discord.com/developers/docs/quick-start/getting-started).
