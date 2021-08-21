const {getCurrentBranchName} = require('../../util')
const createBranchName = require('./create-branch-name')

async function createGitArgs({ticketId, format, ticketPrefix, gitRemote}) {
  const localBranchName = await getCurrentBranchName()
  const remoteBranchName = await createBranchName({
    ticketId,
    format,
    ticketPrefix,
  })
  return ['push', gitRemote, '-u', `${localBranchName}:${remoteBranchName}`]
}

module.exports = createGitArgs
