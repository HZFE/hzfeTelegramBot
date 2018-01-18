import TelegramBot from 'node-telegram-bot-api';
import config from './config';
import members from './hzfeLink';
import { memberLinksToMD } from './utils';

const token = config.TOKEN;
const name = "hzfeBot";

const bot = new TelegramBot(token, {polling: true});

const testAccount = ['gongpeione'];

function metionedMe (msg) {
    const content = msg.text;
    const sendToMeReg = new RegExp(`^@${name}`);
    if (testAccount.indexOf(msg.from.username) > -1) {
        return true;
    }
    if (!sendToMeReg.test(content)) {
        return;
    }
}

bot.onText(/\/start/, (msg, match) => {
    if (!metionedMe(msg)) {
        return;
    }
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello there!');
});

bot.onText(/\/link\s(.+)/, (msg, match) => {
    if (!metionedMe(msg)) {
        return;
    }
    const chatId = msg.chat.id;
    const name = match[1];
    let returnMsg = '';
    let replyMarkup = [[]];
    const optionals = { 
        parse_mode: 'Markdown',
    }

    if (name === 'list') {
        returnMsg = '请选择成员';
        const membersList = Object.keys(members);
        for (let i = 0; i < membersList.length; i++) {
            replyMarkup.push([{
                text: '/link ' + membersList[i]
            }]);
        }
        optionals['reply_markup'] = {};
        optionals['reply_markup']['keyboard'] = replyMarkup;
    } else if (/h(elp)?/i.test(name)) {
        returnMsg = '显示所有成员：/link list\n查询成员链接：/link [member-name]';
        optionals.parse_mode = null;
    } else if (name in members) {
        returnMsg = memberLinksToMD(name, members[name]);
        optionals['reply_markup'] = {
            remove_keyboard: true
        };
    }

    bot.sendMessage(
        chatId, 
        returnMsg, 
        optionals
    );
})

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const content = msg.text;
    const cmdReg = new RegExp(`^@${name}\\s+/(\\w+)\\s?([\\s\\w]+)?`);

    if (!metionedMe(msg)) {
        return;
    }

    let cmd = content.match(cmdReg);
    // console.log(cmd);

    bot.emit(`/${cmd[1]}`, msg, cmd[2]);
    // bot.sendMessage(chatId, 'Message received!');
});