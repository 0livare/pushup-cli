const emoji = require('node-emoji')
const execa = require('execa')
const chalk = require('chalk')
const os = require('os')

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

async function getGitRemotes(cwd) {
  try {
    const {stdout: gitRemotesRaw} = await execa('git', ['remote'], {
      cwd: resolveHomePath(cwd),
    })
    return gitRemotesRaw.split('\n')
  } catch (e) {
    return []
  }
}

async function getRemoteGitBranches() {
  try {
    const {stdout: rawRemoteBranches} = await execa('git', ['branch', '-r'])

    // Git prints remote branch prefixed with the remote
    // e.g. origin/foobar
    return rawRemoteBranches
      .split('\n')
      .map(remoteBranch => removeRemoteFromBranchName(remoteBranch))
  } catch (e) {
    return []
  }
}

async function getCurrentBranchName() {
  try {
    const {stdout: localBranchName} = await execa('git', [
      'branch',
      '--show-current',
    ])
    return localBranchName
  } catch (e) {
    error(e)
    process.exit(1)
  }
}

async function getCurrentRemoteTrackingBranch() {
  try {
    // e.g. origin/foo
    const {stdout: remoteTrackingBranch} = await execa('git', [
      'rev-parse',
      '--abbrev-ref',
      '--symbolic-full-name',
      '@{u}',
    ])

    return removeRemoteFromBranchName(remoteTrackingBranch)
  } catch (e) {
    return null
  }
}

function removeRemoteFromBranchName(branchName) {
  return branchName.substring(branchName.indexOf('/') + 1)
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

/**
 * Remove "~" from path strings by replacing it with the
 * path to the user's home directory
 */
function resolveHomePath(pathWithTilde) {
  return pathWithTilde.replace('~', os.homedir())
}

module.exports = {
  error,
  warn,
  executeGitCommand,
  getGitRemotes,
  getRemoteGitBranches,
  getCurrentBranchName,
  getCurrentRemoteTrackingBranch,
  ticketIdPrefixToNumber,
  resolveHomePath,
}
