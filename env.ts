import * as Dotenv from 'https://deno.land/std@0.201.0/dotenv/mod.ts'

export const env = await Dotenv.load()

export const {
  GATHER_OWNER_NAME,
  GATHER_BOT_NAME,
  GATHER_API_KEY,
  GATHER_SPACE_ID,
  GATHER_SPACE_NAME,
} = env

// Gameオブジェクトに指定する際に必要な文字列
// e.g. SPACE_ID\SPACE_NAME
export const GATHER_SPACE_INFO = `${GATHER_SPACE_ID}\\${GATHER_SPACE_NAME}`
