#!/usr/bin/env node

const cli = require('commander')
const package = require('../package.json')

cli
  .command('create', {isDefault: true})
  .description(
    "Automatically create remote git branches that follow your team's standard",
  )
  .action(require('./commands/create'))
  .argument('[ticket]', 'A ticket identifier')
  .option('-d, --delete', 'Synonym for "pushup delete" command')
  .option(
    '--format <format>',
    'The format of the name of the remote branch name to be created',
  )
  .option(
    '-r, --gitRemote <gitRemote>',
    'The git remote that a branch should be pushed to',
  )
  .option('-i, --initials <initials>', 'The initials of your name')
  .option('-t, --ticket <ticket>', 'A ticket identifier')
  .option(
    '-p, --ticketPrefix <ticketPrefix>',
    'The alphabetic prefix that should be appended to ticket IDs',
  )
  .allowUnknownOption()

cli
  .command('delete')
  .description(
    'Automatically delete the remote git branch corresponding to a particular ticket number',
  )
  .action(require('./commands/delete'))
  .argument('[ticket]', 'A ticket identifier')
  .option(
    '--format <format>',
    'The format of the name of the remote branch name to be deleted',
  )
  .option(
    '-r, --gitRemote <gitRemote>',
    'The git remote that a branch should be deleted from',
  )
  .option('-i, --initials <initials>', 'The initials of your name')
  .option('-t, --ticket <ticket>', 'A ticket identifier')
  .option(
    '-p, --ticketPrefix <ticketPrefix>',
    'The alphabetic prefix that should be appended to ticket IDs',
  )
  .allowUnknownOption()

cli
  .command('init')
  .description('Create a pushup config file via interactive prompts')
  .action(require('./commands/init'))
  .option(
    '--format <format>',
    'The format of the name of the remote branch name to be deleted',
  )
  .option(
    '-r, --gitRemote <gitRemote>',
    'The git remote that a branch should be deleted from',
  )
  .option('-i, --initials <initials>', 'The initials of your name')
  .option(
    '-p, --ticketPrefix <ticketPrefix>',
    'The alphabetic prefix that should be appended to ticket IDs',
  )

cli
  .command('open')
  .description('Open a ticket in your web browser')
  .action(require('./commands/open'))
  .argument('[ticket]', 'A ticket identifier')
  .option(
    '--format <format>',
    'The format of the name of the remote branch name to be deleted',
  )
  .option('-i, --initials <initials>', 'The initials of your name')
  .option(
    '-p, --ticketPrefix <ticketPrefix>',
    'The alphabetic prefix that should be appended to ticket IDs',
  )
  .option('-t, --ticket <ticket>', 'A ticket identifier')
  .option(
    '-u, --ticketUrl <ticketUrl>',
    'The format of the URLs for your ticketing system',
  )

cli.version(package.version).parse(process.argv)
