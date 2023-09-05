import * as Asserts from 'https://deno.land/std/testing/asserts.ts'
import * as OptionsParser from './options-parser.ts'

Deno.test('About safeParse() function', async (t) => {
  await t.step('parsing about arguments', async (t) => {
    await t.step(
      'returns succeed parsed options and parser object pair',
      () => {
        type Parsed = {
          message: string
        }

        const commandName = 'hello'
        const options: OptionsParser.OptionParsingOptions = {
          message: {
            kind: 'arg',
            type: 'string',
          },
        }
        const message = 'Hello, world'

        const contents = ['@testbot', commandName, message]

        const [parsed, parser] = OptionsParser.safeParse<Parsed>({
          commandName,
          options,
        })(contents.slice(2))

        Asserts.assert(parsed.success)
        Asserts.assertEquals(parsed.data.message, message)
      },
    )
  })

  await t.step('parsing about flags', async (t) => {
    await t.step(
      'returns succeed parsed options and parser object pair',
      async (t) => {
        type Parsed = {
          x: number
          y: number
          player: string | undefined
        }

        const commandName = 'teleport'
        const options: OptionsParser.OptionParsingOptions = {
          x: {
            kind: 'flag',
            type: 'integer',
            description: 'The coodinate of x',
          },
          y: {
            kind: 'flag',
            type: 'integer',
            description: 'The coodinate of x',
          },
          player: {
            kind: 'flag',
            type: 'string',
            short: 'u',
            description: 'The coodinate of x',
            optional: true,
          },
        }

        const contents = '/teleport -x 10 -y 20 -u me'.split(' ')

        const [parsed, parser] = OptionsParser.safeParse<Parsed>({
          commandName,
          options,
        })(contents.slice(1))

        Asserts.assert(parsed.success)
        Asserts.assertEquals(parsed.data.x, 10)
        Asserts.assertEquals(parsed.data.y, 20)
        Asserts.assertEquals(parsed.data.player, 'me')
      },
    )
  })
})
