import {
  ArgumentOptions,
  ArgumentType,
  boolean,
  Command,
  integer,
  number,
  string,
} from '~/deps/clay.ts'

import type { ArgumentError, HelpError } from '~/deps/clay.ts'

import type { Result } from '~/src/helpers/result.ts'
import { tryWith } from '~/src/helpers/result.ts'

export type Parser = Command<Record<never, never>>

const optionParsingOptionTypes = [
  'string',
  'number',
  'integer',
  'boolean',
] as const satisfies readonly string[]

type OptionParsingOptionTypes = (typeof optionParsingOptionTypes)[number]

const clayTypeTable = {
  string,
  number,
  integer,
  boolean,
} as const satisfies {
  string: ArgumentType<string>
  number: ArgumentType<number>
  integer: ArgumentType<number>
  boolean: ArgumentType<boolean>
}

export type OptionParsingOptionsAboutArg = {
  type: OptionParsingOptionTypes
  optional?: boolean
}

export type OptionParsingOptionsAboutFlag = OptionParsingOptionsAboutArg & {
  short?: string
  description: string
}

export type OptionParsingOptionsConfig =
  | { kind: 'arg' } & OptionParsingOptionsAboutArg
  | { kind: 'flag' } & OptionParsingOptionsAboutFlag

export type OptionParsingOptions = {
  [parameter: string]: OptionParsingOptionsConfig
}

interface OptionsParsingConfig {
  commandName: string
  options: OptionParsingOptions
}

const tryToGetDescription = (
  config: OptionParsingOptionsConfig,
): string | undefined =>
  Object.entries(config)
    .find(([k, v]) => typeof v === 'string' && k === 'description')?.[1]
    ?.toString()

const parseAsClayType = (typ: OptionParsingOptionTypes) => clayTypeTable[typ]

export type ParseError = ArgumentError | HelpError | Error

export const safeParse = <Parsed extends object = Record<never, never>>(
  { commandName, options }: OptionsParsingConfig,
) =>
(
  contents: string[],
): [
  Result<ParseError, Parsed>,
  Parser,
] => {
  const parser = Object.entries(options).reduce(
    (parser, [parameter, config]) => {
      const typ = parseAsClayType(config.type)

      const description = tryToGetDescription(config)

      let flags: string[] = []
      if (config.kind === 'flag') {
        flags = config.short
          ? [config.short, String(parameter)]
          : [String(parameter)]
      }

      let opts: ArgumentOptions | undefined = undefined
      if (config.kind === 'flag') {
        opts = { flags, description }
      }

      if (config?.optional) {
        return parser.optional<unknown, string>(
          typ,
          String(parameter),
          opts,
        )
      } else {
        return parser.required<unknown, string>(
          typ,
          String(parameter),
          opts,
        )
      }
    },
    new Command(commandName),
  )

  return [tryWith(() => parser.parse(contents) as Parsed), parser]
}
