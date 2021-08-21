const createBranchName = require('./create-branch-name')

function createGitArgs({ticketId, format, ticketPrefix, gitRemote}) {
  const remoteBranchName = createBranchName({ticketId, format, ticketPrefix})
  return ['push', gitRemote, '-u', `${localBranchName}:${remoteBranchName}`]
}

module.exports = createGitArgs
