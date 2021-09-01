const {getCurrentBranchName} = require('../../util')
const createBranchName = require('./create-branch-name')

async function createGitArgs(config) {
  const localBranchName = await getCurrentBranchName()
  const remoteBranchName = await createBranchName(config)
  return [
    'push',
    config.gitRemote,
    '-u',
    `${localBranchName}:${remoteBranchName}`,
  ]
}

module.exports = createGitArgs
