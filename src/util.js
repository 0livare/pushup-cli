const emoji = require('node-emoji')
const execa = require('execa')
const chalk = require('chalk')

function error(string) {
  const x = emoji.get('x')
  console.log(x + ' ' + string)
}

function warn(string) {
  console.log(`${emoji.get('warning')} ${string}`)
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

async function getCurrentRemoteTrackingBranch() {
  try {
    const {stdout: remoteTrackingBranch} = await execa('git', [
      'rev-parse',
      '--abbrev-ref',
      '--symbolic-full-name',
      '@{u}',
    ])
    return remoteTrackingBranch
  } catch (e) {
    return null
  }
}

function ticketIdPrefixToNumber({ticketId, ticketPrefix}) {
  const ticketIdContainsPrefix = ticketId && ticketId.match(/^[a-zA-Z]/)

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
  getCurrentRemoteTrackingBranch,
  ticketIdPrefixToNumber,
}
