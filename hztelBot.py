from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
import logging, json

config = json.load(open('config.json'))

updater = Updater(token=config['TOKEN'])

dispatcher = updater.dispatcher
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

def start(bot, update):
    bot.send_message(chat_id=update.message.chat_id, text="I'm a HZFE bot, please talk to me!")

def echo(bot, update):
    bot.send_message(chat_id=update.message.chat_id, text=update.message.text)

dispatcher.add_handler(CommandHandler('start', start))
dispatcher.add_handler(MessageHandler(Filters.text, echo))

updater.start_polling()
updater.idle()