const chalk = require('chalk')
const {error} = require('../../util')
const findBranchName = require('./find-branch-name')

async function createGitArgs(config) {
  const remoteBranchName = await findBranchName(config)

  if (!remoteBranchName) {
    let errorMsg = config.ticketId
      ? `No branch matching ticket ${chalk.yellow(
          config.ticketId,
        )} could be found`
      : 'No matching remote branch could be found, did you forget to supply a ticket?'

    error(errorMsg)
    process.exit(0)
  }

  return ['push', config.gitRemote, `:${remoteBranchName}`]
}

module.exports = createGitArgs
