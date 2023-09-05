import { Game } from '~/deps/gather-game-client.ts'

import * as ENV from '~/env.ts'

export const game = new Game(
  ENV.GATHER_SPACE_INFO,
  () => Promise.resolve({ apiKey: ENV.GATHER_API_KEY }),
)
