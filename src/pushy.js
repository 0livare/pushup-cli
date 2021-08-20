#!/usr/bin/env node

const execa = require('execa')
const emoji = require('node-emoji')

const config = require('../config.json')

async function main() {
  if (process.argv.length < 3) {
    const x = emoji.get('x')
    console.log(
      `${x} You must provide ticket number, for example:\n\n\tpushy 444\n`,
    )
    process.exit(1)
  }

  const {ticketPrefix, ticketDivider, gitRemote, developerInitials} = config

  const ticketId = process.argv[2]
  const ticketNumber = ticketId.includes(ticketPrefix)
    ? ticketId
    : `${ticketPrefix}${ticketDivider}${ticketId}`

  const {stdout: localBranchName} = await execa('git', [
    'branch',
    '--show-current',
  ])

  const remoteBranchName = [
    ticketNumber,
    ticketDivider,
    developerInitials,
    ticketDivider,
    localBranchName,
  ].join('')

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
