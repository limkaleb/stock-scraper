import { Bot } from 'grammy';
import scrap from './scrap.js'

const bot = new Bot('1200197757:AAHHHItjtDGqyldnfBfkZHvZma69bJH1fcI');

bot.command('start', (ctx) => ctx.reply("Welcome! Up and running."));
// Reply to any message with "Hi there!".
// bot.on('message', (ctx) => ctx.reply('Hi there zzz!'));

bot.on('message', async (ctx) => {
  const message = ctx.message; // the message object
  console.log('message is: ', message)

  const company = message.text
  const res = await scrap(company)
  console.log('res: ', res)
  ctx.reply('Latest EPS: ' + res.q2['2023'])
});

bot.start();