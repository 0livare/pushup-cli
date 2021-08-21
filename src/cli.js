#!/usr/bin/env node

const cli = require('commander')
const package = require('../package.json')

cli
  .command('push', {isDefault: true})
  .description(
    "Automatically push remote git branches that follow your team's standard.",
  )
  .action(require('./commands/push'))
  .argument('[ticket]', 'A ticket identifier')
  .option('-t, --ticket <ticket>', 'A ticket identifier')
  .option(
    '--format <format>',
    'The format of the remote branch name to be pushed',
  )
  .option(
    '-p, --ticketPrefix <ticketPrefix>',
    'The alphabetic prefix that should be appended to ticket IDs',
  )
  .option(
    '-r, --gitRemote <gitRemote>',
    'The git remote that a branch should be pushed to',
  )
  .allowUnknownOption()

cli.version(package.version).parse(process.argv)
