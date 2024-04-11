# Flaky

A User Installable Discord Bot using discord.js

## Running

Make sure you have configured the bot, with proper credentials (see [config](#config))

#### Run development version of the bot

This is recommended for testing/developing the bot.

```sh
yarn dev
# or
npm run dev
```

#### Run the main bot

```sh
yarn start
# or
npm start
```

## Config

Flaky uses `dotenv` for credentials.

-   `token` - the Bot's token
-   `dev_token` - Development version of the bot
-   `weather_api_key` - a [WeatherAPI](https://weatherapi.com) key
-   `client_id` - the Bot's ID
