const findBranchName = require('./find-branch-name')

jest.mock('execa')
jest.mock('inquirer')

const execa = require('execa')
const inquirer = require('inquirer')

function mockRemoteBranches(branches) {
  execa.mockResolvedValue({stdout: branches.join('\n')})
}

it('finds exact match from single remote branch', async () => {
  mockRemoteBranches(['origin/ZACH-123'])

  const branchToDelete = await findBranchName({
    ticketPrefix: 'ZACH-',
    ticketId: '123',
  })

  expect(branchToDelete).toBe('ZACH-123')
})

it('finds exact match from multiple remote branches', async () => {
  mockRemoteBranches(['origin/ZACH-123', 'origin/ZACH-456', 'origin/ZACH-789'])
  const branchToDelete = await findBranchName({
    ticketPrefix: 'ZACH-',
    ticketId: '456',
  })

  expect(branchToDelete).toBe('ZACH-456')
})

it('suggests partial match from a single remote branch', async () => {
  mockRemoteBranches(['origin/FOO-123'])
  inquirer.prompt.mockResolvedValue({chosenBranch: true})

  const branchToDelete = await findBranchName({
    ticketPrefix: 'ZACH-',
    ticketId: '123',
  })

  const {choices} = inquirer.prompt.mock.calls[0][0][0]
  expect(choices).toContain('FOO-123')
})

it('suggests partial match from multiple remote branches', async () => {
  mockRemoteBranches(['origin/FOO-123', 'origin/FOO-456', 'origin/FOO-789'])
  inquirer.prompt.mockResolvedValue({chosenBranch: true})

  const branchToDelete = await findBranchName({
    ticketPrefix: 'ZACH-',
    ticketId: '789',
  })

  const {choices} = inquirer.prompt.mock.calls[0][0][0]
  expect(choices).toContain('FOO-123')
})

it('returns the selected branch', async () => {
  execa.mockResolvedValue({stdout: 'origin/FOO-123'})
  inquirer.prompt.mockResolvedValue({chosenBranch: 'ZACH-123'})

  const branchToDelete = await findBranchName({
    ticketPrefix: 'ZACH-',
    ticketId: '123',
  })

  expect(branchToDelete).toBe('ZACH-123')
})
