const findBranchName = require('./find-branch-name')

async function createGitArgs({ticketId, format, ticketPrefix, gitRemote}) {
  const remoteBranchName = await findBranchName({
    ticketId,
    format,
    ticketPrefix,
    gitRemote,
  })

  if (!remoteBranchName) process.exit(0)

  return ['push', gitRemote, `:${remoteBranchName}`]
}

module.exports = createGitArgs
