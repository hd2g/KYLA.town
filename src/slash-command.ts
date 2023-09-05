import { Game, GameEventByCase } from '~/deps/gather-game-client.ts'

import type { OptionParsingOptions } from '~/src/bot/options-parser.ts'
import * as Options from '~/src/bot/options-parser.ts'
import * as Bot from '~/src/bot.ts'

export interface DefineSlashCommandOptions<GameEvent, > {
  game: Game
  options: OptionParsingOptions,
  call: (
    game: Game,
    data: GameEventByCase<GameEvent>,
    options: { [parameter in keyof OptionParsingOptions]: unknown },
  ) => void
}

const isSlashCommand = (command: string): boolean => command.startsWith('/')

export const defineSlashCommand = (
  commandName: string,
  {
    game,
    options,
    call,
  }: DefineSlashCommandOptions<'PlayerChats'>,
): void | Promise<void> => {
  game.subscribeToEvent(
    'playerChats',
    (data: GameEventByCase<'PlayerChats'>) => {
      const { playerChats } = data
      console.log({ playerChats })

      if (!isSlashCommand(playerChats.contents)) return

      const [parsed, parser] = Options.safeParse({
        commandName,
        options,
      })(playerChats.contents.split(' ').slice(1))
      if (!parsed.success) {
        console.error({ error: parsed.error })
        Bot.chat(game, data, parsed.error.message)
        return
      }

      return call(game, data, parsed.data)
    },
  )
}
