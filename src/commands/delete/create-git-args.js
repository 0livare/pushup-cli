const chalk = require('chalk')
const {error} = require('../../util')
const findBranchName = require('./find-branch-name')

async function createGitArgs({ticketId, format, ticketPrefix, gitRemote}) {
  const remoteBranchName = await findBranchName({
    ticketId,
    format,
    ticketPrefix,
    gitRemote,
  })

  if (!remoteBranchName) {
    let errorMsg = ticketId
      ? `No branch matching ticket ${chalk.yellow(ticketId)} could be found`
      : 'No matching remote branch could be found, did you forget to supply a ticket?'

    error(errorMsg)
    process.exit(0)
  }

  return ['push', gitRemote, `:${remoteBranchName}`]
}

module.exports = createGitArgs
