from telegram.ext import Updater, CommandHandler
import logging

with open('token.txt') as file:
    tokenStr = file.readline().split('\n')[0]

updater = Updater(token=tokenStr)
dispatcher = updater.dispatcher
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

def start(bot, update):
    bot.send_message(chat_id=update.message.chat_id, text="I'm a HZFE bot, please talk to me!")

start_handler = CommandHandler('start', start)
dispatcher.add_handler(start_handler)

updater.start_polling()
updater.idle()
