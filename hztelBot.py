from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
import logging, json
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

class TelegramBot :
    
    def __init__(self, token):
        self.__token = token
        self.__updater = Updater(token=self.__token)
        self.__dispatcher = self.__updater.dispatcher

    def run(self):
        self.__updater.start_polling()
        self.__updater.idle()

    def addHandler(self, handlerType, handlerName, handler, **kwargs):
        self.__dispatcher.add_handler(handlerType(handlerName, handler, **kwargs))


def start(bot, update):
    bot.send_message(chat_id=update.message.chat_id, text="I'm a HZFE bot, please talk to me!")

def echo(bot, update):
    bot.send_message(chat_id=update.message.chat_id, text=update.message.text)

def caps(bot, update, args):
   text_caps = ' '.join(args).upper()
   bot.send_message(chat_id=update.message.chat_id, text=text_caps)

config = json.load(open('config.json'))
telBot = TelegramBot(config['TOKEN'])
telBot.addHandler(CommandHandler, 'start', start)
telBot.addHandler(CommandHandler, 'caps', caps, pass_args=True)
telBot.run()

# dispatcher.add_handler(CommandHandler('start', start))
# dispatcher.add_handler(MessageHandler(Filters.text, echo))