const emoji = require('node-emoji')
const execa = require('execa')
const chalk = require('chalk')

function error(string) {
  const x = emoji.get('x')
  console.log(`${x} ${string}\n`)
}

function warn(string) {
  console.log(`${emoji.get('warning')} ${string}\n`)
}

async function executeGitCommand(gitArgs) {
  try {
    console.log(chalk.gray(`$ git ${gitArgs.join(' ')}`))
    await execa('git', gitArgs, {stdio: 'inherit'})
  } catch (e) {
    // Do nothing here, git's error message will be displayed
  }
}

async function getCurrentBranchName() {
  const {stdout: localBranchName} = await execa('git', [
    'branch',
    '--show-current',
  ])

  return localBranchName
}

function determineTicketNumber({ticketId, ticketPrefix}) {
  const ticketIdContainsPrefix = ticketId && ticketId.match(/^[a-zA-Z]/)
  if (!ticketIdContainsPrefix && !ticketPrefix) {
    warn('No ticket prefix was found, only the ticket ID will be used')
  }

  return ticketIdContainsPrefix
    ? ticketId
    : ticketPrefix && ticketId
    ? `${ticketPrefix}${ticketId}`
    : ticketId
    ? ticketId
    : ''
}

module.exports = {
  error,
  warn,
  executeGitCommand,
  getCurrentBranchName,
  determineTicketNumber,
}
