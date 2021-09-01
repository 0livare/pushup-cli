const findBranchNames = require('./find-branch-names')

jest.mock('../create/create-branch-name')
const createBranchName = require('../create/create-branch-name')

jest.mock('../../util', () => {
  const actualUtil = jest.requireActual('../../util')

  return {
    ...actualUtil,
    getRemoteGitBranches: jest.fn(() => []),
    getCurrentRemoteTrackingBranch: jest.fn(),
  }
})
const util = require('../../util')

function mockRemoteBranches(branches) {
  util.getRemoteGitBranches.mockResolvedValueOnce(branches)
}

function mockRemoteTrackingBranch(name) {
  util.getCurrentRemoteTrackingBranch.mockResolvedValueOnce(name)
}

beforeEach(() => {
  createBranchName.mockClear()
  util.getRemoteGitBranches.mockClear()
  util.getCurrentRemoteTrackingBranch.mockClear()
})

it('finds exact match from single remote branch', async () => {
  mockRemoteBranches(['ZACH-123'])

  const result = await findBranchNames({
    ticketPrefix: 'ZACH-',
    ticketId: '123',
  })

  expect(result).toHaveLength(1)
  expect(result).toContain('ZACH-123')
})

it('finds exact match from multiple remote branches', async () => {
  mockRemoteBranches(['ZACH-123', 'ZACH-456', 'ZACH-789'])
  const result = await findBranchNames({
    ticketPrefix: 'ZACH-',
    ticketId: '456',
  })

  expect(result).toHaveLength(1)
  expect(result).toContain('ZACH-456')
})

it('suggests partial match from a single remote branch', async () => {
  mockRemoteBranches(['FOO-123'])

  const result = await findBranchNames({
    ticketPrefix: 'ZACH-',
    ticketId: '123',
  })

  expect(result).toHaveLength(1)
  expect(result).toContain('FOO-123')
})

it('suggests partial match from multiple remote branches', async () => {
  mockRemoteBranches(['FOO-123', 'FOO-456', 'FOO-789'])

  const result = await findBranchNames({
    ticketPrefix: 'ZACH-',
    ticketId: '123',
  })

  expect(result).toHaveLength(1)
  expect(result).toContain('FOO-123')
})

it('finds a match when no ticket information is available', async () => {
  mockRemoteBranches('zp-myBranch')
  createBranchName.mockReturnValueOnce('zp-myBranch')

  const result = await findBranchNames({
    format: 'zp-BRANCH-TICKET',
  })

  expect(result).toHaveLength(1)
  expect(result).toContain('zp-myBranch')
})

it('does not suggest deleting a branch that does not exist', async () => {
  // Note: Do not mock remote branches
  createBranchName.mockReturnValueOnce('zp-myBranch')

  const result = await findBranchNames({
    format: 'zp-BRANCH-TICKET',
  })

  expect(result).toHaveLength(0)
})

it('suggests deleting remote tracking branch', async () => {
  mockRemoteTrackingBranch('remoteTrackingBranch')
  const result = await findBranchNames({})

  expect(result).toHaveLength(1)
  expect(result).toContain('remoteTrackingBranch')
})

it('suggests remote tracking branch and also an exact ticket match', async () => {
  mockRemoteTrackingBranch('remoteTrackingBranch')
  mockRemoteBranches(['ZACH-123'])

  const result = await findBranchNames({
    ticketPrefix: 'ZACH-',
    ticketId: '123',
  })

  expect(result).toHaveLength(2)
  expect(result).toContain('ZACH-123')
  expect(result).toContain('remoteTrackingBranch')
})

it('suggests remote tracking branch and also a partial ticket match', async () => {
  mockRemoteTrackingBranch('remoteTrackingBranch')
  mockRemoteBranches(['FOO-123', 'FOO-456', 'FOO-789'])

  const result = await findBranchNames({
    ticketPrefix: 'ZACH-',
    ticketId: '123',
  })

  expect(result).toHaveLength(2)
  expect(result).toContain('FOO-123')
  expect(result).toContain('remoteTrackingBranch')
})

it('suggests remote tracking branch and also created branch name', async () => {
  mockRemoteTrackingBranch('remoteTrackingBranch')
  mockRemoteBranches('zp-myBranch')
  createBranchName.mockReturnValueOnce('zp-myBranch')

  const result = await findBranchNames({
    format: 'zp-BRANCH-TICKET',
  })

  expect(result).toHaveLength(2)
  expect(result).toContain('zp-myBranch')
  expect(result).toContain('remoteTrackingBranch')
})
