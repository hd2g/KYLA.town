import { Game } from 'npm:@gathertown/gather-game-client@43.0.1'
import * as Dotenv from 'https://deno.land/std@0.201.0/dotenv/mod.ts'

const env = await Dotenv.load()

const {
  GATHER_BOT_NAME,
  GATHER_API_KEY,
  GATHER_SPACE_ID,
  GATHER_SPACE_NAME,
} = env

// Gameオブジェクトに指定する際に必要な文字列
// e.g. SPACE_ID\SPACE_NAME
const GATHER_SPACE_INFO = `${GATHER_SPACE_ID}\\${GATHER_SPACE_NAME}`

const game = new Game(
  GATHER_SPACE_INFO,
  () => Promise.resolve({ apiKey: GATHER_API_KEY })
)

game.connect()

game.subscribeToConnection(connected => {
  console.log({ connected })

  if (!connected) return

  game.subscribeToEvent('info', console.info)
  game.subscribeToEvent('warn', console.warn)
  game.subscribeToEvent('error', console.error)
})
