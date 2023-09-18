import * as ENV from '~/env.ts'
import { game } from '~/src/game.ts'
import * as Bot from '~/src/bot.ts'
import { defineBotCommand } from '~/src/bot.ts'

const bot = ENV.GATHER_BOT_NAME

game.connect()

Bot.enter(game, bot)

game.subscribeToConnection(connected => {
  console.log({ connected })

  if (!connected) return

  game.subscribeToEvent('info', console.info)
  game.subscribeToEvent('warn', console.warn)
  game.subscribeToEvent('error', console.error)
})

defineBotCommand('hello', {
  game,
  bot,
  options: {
    message: {
      kind: 'arg',
      type: 'string',
    },
  },
  call(game, data, { message }) {
    Bot.chat(game, data, `Hello, ${message}`)
  },
})
