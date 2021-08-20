#!/usr/bin/env node

const execa = require('execa')
const emoji = require('node-emoji')
const {cosmiconfigSync} = require('cosmiconfig')

const defaultConfig = {
  ticketPrefix: '',
  divider: '-',
  gitRemote: 'origin',
  format: 'TICKET-BRANCH',
}

async function main() {
  if (process.argv.length < 3) {
    error('You must provide ticket number, for example:\n\n\tpushy 444')
  }

  const explorer = cosmiconfigSync('pushy')
  let {config} = explorer.search()

  config = {
    ...defaultConfig,
    ...config,
  }

  const {ticketPrefix, gitRemote, format} = config

  const ticketId = process.argv[2]

  const ticketIdContainsPrefix = ticketId.match(/^[a-zA-Z]/)
  if (!ticketIdContainsPrefix && !ticketPrefix) {
    warn('No ticket prefix was found, only the ticket ID will be used')
  }

  const ticketNumber =
    ticketPrefix && !ticketIdContainsPrefix
      ? `${ticketPrefix}${ticketId}`
      : ticketId

  const {stdout: localBranchName} = await execa('git', [
    'branch',
    '--show-current',
  ])

  const remoteBranchName = format
    .replace('TICKET', ticketNumber)
    .replace('BRANCH', localBranchName)

  try {
    await execa(
      'git',
      ['push', gitRemote, '-u', `${localBranchName}:${remoteBranchName}`],
      {stdio: 'inherit'},
    )
  } catch (e) {
    // Do nothing here, git's error message will be displayed
  }
}

main()

function error(string) {
  const x = emoji.get('x')
  console.log(`${x} ${string}\n`)
  process.exit(1)
}

function warn(string) {
  console.log(`${emoji.get('warning')} ${string}\n`)
}
