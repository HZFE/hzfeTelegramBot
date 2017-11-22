import TelegramBot from 'node-telegram-bot-api';
import config from './config';
import members from './hzfeLink';

const token = config.TOKEN;

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello there!');
});

function memberLinksToMD(name, links) {
    return (
        links.website ? 
            `${name}的网站是：[${links.website}](${links.website})` : 
            `${name}还没有网站`
    ) +
    '，' + 
    (
        links.github ? 
            `${name}的 Github 是：[@${links.github}](https://github.com/${links.github})` : 
            `${name}还没有 Github`
    );
}
bot.onText(/\/link\s(.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const name = match[1];
    let returnMsg = '';
    let parseMode = 'Markdown';

    if (name === 'list') {
        returnMsg = '成员列表：' + Object.keys(members).join('，');
    } else if (/h(elp)?/i.test(name)) {
        returnMsg = '显示所有成员：/link list\n查询成员链接：/link [member name]';
        parseMode = null;
    } else if (name in members) {
        returnMsg = memberLinksToMD(name, members[name]);
    }

    bot.sendMessage(
        chatId, 
        returnMsg, 
        { parse_mode: parseMode }
    );
})

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     if(msg.indexOf('/') === 0) {
//         return;
//     }
//     bot.sendMessage(chatId, 'Message received!');
// });