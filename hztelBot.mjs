import fs from 'fs';

import TelegramBot from 'node-telegram-bot-api';
import config from './config';
import pathConfig from './path';
import members from './hzfeLink';
import { memberLinksToMD } from './utils';

const token = config.TOKEN;
const botName = "hzfeBot";

const bot = new TelegramBot(token, {polling: true});

const testAccount = ['gongpeione'];

const helpText = `
雷猴我是一个机器人，我阔以做这些事：
[@${botName} /start] 显示初始信息
[@${botName} /help] 查看帮助
[@${botName} /link] 查看 HZFEer 链接
`;

function metionedMe (msg) {
    const content = msg.text;
    const sendToMeReg = new RegExp(`^@${botName}`);
    // if (testAccount.indexOf(msg.from.username) > -1) {
    //     return true;
    // }
    if (!sendToMeReg.test(content)) {
        return;
    }
    return true;
}

bot.onText(/\/start/, (msg, match) => {
    if (!metionedMe(msg)) {
        return;
    }
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello there!');
});

bot.onText(/\/help/, (msg, match) => {
    if (!metionedMe(msg)) {
        return;
    }
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, helpText);
});

bot.onText(/\/ss/, (msg, match) => {
    if (!metionedMe(msg)) {
        return;
    }
    const chatId = msg.chat.id;
    const ssInfo = fs.readFileSync(pathConfig.SS_PATH);
    bot.sendMessage(chatId, ssInfo);
    bot.sendPhoto(chat_id, pathConfig.SS_IMG);
});

bot.onText(/\/ssr/, (msg, match) => {
    if (!metionedMe(msg)) {
        return;
    }
    const chatId = msg.chat.id;
    const ssInfo = fs.readFileSync(pathConfig.SSR_PATH);
    bot.sendMessage(chatId, ssInfo);
    bot.sendPhoto(chat_id, pathConfig.SSR_IMG);
});

bot.onText(/\/link\s(.+)/, (msg, match) => {
    if (!metionedMe(msg)) {
        return;
    }
    let chatId = msg.chat.id;
    const name = match[1];
    let returnMsg = '';
    let replyMarkup = [[]];
    const optionals = { 
        parse_mode: 'Markdown',
    }
    const help = `显示所有成员：@${botName} /link list\n查询成员链接：@${botName} /link [member-name]`;
    
    if (!name) {
        returnMsg = help;
    }

    const membersList = Object.keys(members);
    if (name === 'list') {
        returnMsg = `@${msg.from.username} 请选择成员`;
        for (let i = 0; i < membersList.length; i++) {
            replyMarkup.push([{
                text: `@${botName} /link ${membersList[i]}`
            }]);
        }
        optionals['reply_markup'] = {};
        optionals['reply_markup']['keyboard'] = replyMarkup;
        optionals['reply_markup']['selective'] = true; // 只给对应用户弹键盘，但并没有什么用
        // optionals['reply_to_message_id'] = msg.message_id;
        // chatId = msg.from.id;
    } else if (/h(elp)?/i.test(name)) {
        returnMsg = help;
        optionals.parse_mode = null;
    } else {
        const nameInList = membersList.filter(m => m.indexOf(name) > -1);
        if (nameInList.length > 1) {
            returnMsg = '名字再具体一点。';
        } else {
            console.log(msg);
            returnMsg = memberLinksToMD(name, members[nameInList[0]]);
            optionals['reply_markup'] = {
                remove_keyboard: true
            };
        }
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
    const cmdReg = new RegExp(`^@${botName}\\s+/(\\w+)?\\s?([\\s\\w]+)?`);

    if (!metionedMe(msg)) {
        return;
    }

    let cmd = content.match(cmdReg);
    // console.log(cmd);
    if (!cmd) {
        bot.sendMessage(chatId, helpText);
        return;
    }

    bot.emit(`/${cmd[1]}`, msg, cmd[2]);
    // bot.sendMessage(chatId, 'Message received!');
});