from telegram.ext import Updater, CommandHandler, MessageHandler, InlineQueryHandler, Filters
from telegram import InputTextMessageContent, InlineQueryResultArticle
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

    def addHandler(self, handlerType, handler, handlerName = '', pass_args = False, **kwargs):
        if handlerName:
            self.__dispatcher.add_handler(handlerType(handlerName, handler, **kwargs))
        else:
            self.__dispatcher.add_handler(handlerType(handler, **kwargs))


def start(bot, update):
    bot.send_message(chat_id=update.message.chat_id, text="I'm a HZFE bot, please talk to me!")

def echo(bot, update):
    bot.send_message(chat_id=update.message.chat_id, text=update.message.text)

def caps(bot, update, args):
   text_caps = ' '.join(args).upper()
   bot.send_message(chat_id=update.message.chat_id, text=text_caps)

def inline_caps(bot, update):
    query = update.inline_query.query
    if not query:
        return
    results = list()
    results.append(InlineQueryResultArticle(
        id=query.upper, 
        title='Caps', 
        input_message_content=InputTextMessageContent(query.upper())
    ))
    bot.answer_inline_query(update.inline_query.id, results)


config = json.load(open('config.json'))
telBot = TelegramBot(config['TOKEN'])
telBot.addHandler(CommandHandler, handlerName='start', handler=start)
telBot.addHandler(CommandHandler, handlerName='caps',  handler=caps, pass_args=True)
telBot.addHandler(InlineQueryHandler, handler=inline_caps)
telBot.run()

# dispatcher.add_handler(CommandHandler('start', start))
# dispatcher.add_handler(MessageHandler(Filters.text, echo))