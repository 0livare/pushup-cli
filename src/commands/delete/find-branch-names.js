const {
  ticketIdPrefixToNumber,
  getCurrentRemoteTrackingBranch,
  getRemoteGitBranches,
} = require('../../util')
const createBranchName = require('../create/create-branch-name')

async function findBranchNames(config) {
  const {ticketId, ticketPrefix} = config

  const ticketNumber = ticketIdPrefixToNumber({ticketId, ticketPrefix})
  const remoteBranches = await getRemoteGitBranches()

  const possibleRemoteBranchMatches = []

  const remoteTrackingBranch = await getCurrentRemoteTrackingBranch()
  if (remoteTrackingBranch) {
    possibleRemoteBranchMatches.push(remoteTrackingBranch)
  }

  if (ticketId) {
    const exactMatch = remoteBranches.find(branch =>
      branch.includes(ticketNumber),
    )

    if (exactMatch) {
      possibleRemoteBranchMatches.push(exactMatch)
    } else {
      const partialMatches = remoteBranches.filter(branch =>
        branch.includes(ticketId),
      )

      possibleRemoteBranchMatches.push(...partialMatches)
    }
  } else {
    // If no ticket ID has been provided, then we should
    // delete the same branch that would have been
    // created via the create command for the format
    // they have specified and the local branch they
    // have checked out.
    const possibleRemoteBranchName = await createBranchName(config)

    if (remoteBranches.includes(possibleRemoteBranchName)) {
      possibleRemoteBranchMatches.push(possibleRemoteBranchName)
    }
  }

  return possibleRemoteBranchMatches
}

module.exports = findBranchNames
