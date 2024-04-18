# Flaky

-   [Running](#runnung)
-   [Config](#config)

A User Installable Discord Bot using discord.js

[**Use the bot here**](https://discord.com/oauth2/authorize?client_id=1227563202083160148)

> [!IMPORTANT]
> Click on `Try It Now!` and not `Add to Server`

## Running

> [!IMPORTANT]
> Make sure you have configured the bot, with proper credentials (see [config](#config))

#### Run as development version of the bot

> [!NOTE]
> This is recommended for testing/developing the bot.

```sh
yarn dev
# or
npm run dev
```

#### Run as the main bot

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
-   `dev_client_id`- Development Bot ID
