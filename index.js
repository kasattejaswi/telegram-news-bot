const TelegramBot = require('node-telegram-bot-api')
const scrapeArticles = require('./scrapeArticles')
const token = 'YOUR_TOKEN'
const bot = new TelegramBot(token, { polling: true })

bot.onText(/\/start/, async(msg) => {
    bot.sendMessage(msg.chat.id, "Let me scrape some articles for ya !!")
    const articles = await scrapeArticles(25)
    for (let i of articles) {
        bot.sendMessage(msg.chat.id, i)
    }
})
