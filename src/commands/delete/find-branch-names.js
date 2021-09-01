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

  const possibleRemoteBranchMatches = new Set()

  const remoteTrackingBranch = await getCurrentRemoteTrackingBranch()
  if (remoteTrackingBranch) {
    possibleRemoteBranchMatches.add(remoteTrackingBranch)
  }

  if (ticketId) {
    const exactMatch = remoteBranches.find(branch =>
      branch.includes(ticketNumber),
    )

    if (exactMatch) {
      possibleRemoteBranchMatches.add(exactMatch)
    } else {
      const partialMatches = remoteBranches.filter(branch =>
        branch.includes(ticketId),
      )

      possibleRemoteBranchMatches.add(...partialMatches)
    }
  } else {
    // If no ticket ID has been provided, then we should
    // delete the same branch that would have been
    // created via the create command for the format
    // they have specified and the local branch they
    // have checked out.
    const possibleRemoteBranchName = await createBranchName(config, {
      printWarnings: false,
    })

    if (remoteBranches.includes(possibleRemoteBranchName)) {
      possibleRemoteBranchMatches.add(possibleRemoteBranchName)
    }
  }

  return Array.from(possibleRemoteBranchMatches)
}

module.exports = findBranchNames
