import { HelpError } from '~/deps/clay.ts'
import { Game, GameEventByCase } from '~/deps/gather-game-client.ts'

import type { DefineSlashCommandOptions } from '~/src/slash-command.ts'
import * as Options from '~/src/bot/options-parser.ts'
import type { ParseError, Parser } from '~/src/bot/options-parser.ts'
import * as ENV from '~/env.ts'

export const enter = (game: Game, name: string) => {
  game.enter({ name, isNpc: true })
}

export const chat = (
  game: Game,
  data: GameEventByCase<'PlayerChats'>,
  contents: string,
) => {
  game.chat(
    data.playerChats.recipient,
    [],
    data.playerChats.roomId || '',
    { contents },
  )
}

type BotAccount = string

interface DefineBotCommandOptions<GameEvent>
  extends DefineSlashCommandOptions<GameEvent> {
  bot: BotAccount
}

const isBotCommand = (
  botName: string,
  command: string
): boolean => {
  const headOfCommand = command.split(' ')[0]
  const bot = `@${botName}`
  return headOfCommand === bot
}

const errorMessageFrom = ({
  parser,
  error,
}: {
  parser: Parser
  error: ParseError
}): string => {
  let contents = error.message
  if (!(error instanceof HelpError)) {
    contents += `\n${parser.help()}`
  }
  return contents
}

const chatErrorMessage = (
  game: Game,
  data: GameEventByCase<'PlayerChats'>,
  parser: Parser,
  error: ParseError,
) => {
  chat(game, data, errorMessageFrom({ parser, error }))
}

export const defineBotCommand = (
  commandName: string,
  {
    game,
    bot,
    options,
    call,
  }: DefineBotCommandOptions<'PlayerChats'>,
): void | Promise<void> => {
  game.subscribeToEvent(
    'playerChats',
    (data: GameEventByCase<'PlayerChats'>) => {
      const { playerChats } = data
      console.log(playerChats)

      // NOTE: 勉強会ではBot == 自分のアカウント
      //       ここで必ずreturnしてしまう為コメントアウト
      // if (playerChats.senderName === bot) return
      if (playerChats.senderName !== ENV.GATHER_OWNER_NAME) return
      if (!isBotCommand(bot, playerChats.contents)) return

      const [parsed, parser] = Options.safeParse({
        commandName,
        options,
      })(playerChats.contents.split(' ').slice(2))

      console.log({ parsed })
      if (!parsed.success) {
        chatErrorMessage(game, data, parser, parsed.error)
        console.error(parsed.error)
        return
      }

      console.log(parsed.data)
      return call(game, data, parsed.data)
    },
  )
}
