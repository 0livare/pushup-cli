const createBranchName = require('./create-branch-name')

const execa = require('execa')
jest.mock('execa')
execa.mockResolvedValue({stdout: 'myBranch'})

const ticketInfo = {
  ticketPrefix: 'ZACH-',
  ticketId: '44',
}

it('formats TICKET alone', async () => {
  const remoteBranchName = await createBranchName({
    format: 'TICKET',
    ...ticketInfo,
  })

  expect(remoteBranchName).toBe('ZACH-44')
})

it('formats BRANCH alone', async () => {
  const remoteBranchName = await createBranchName({
    ...ticketInfo,
    format: 'BRANCH',
  })

  expect(remoteBranchName).toBe('myBranch')
})

it('formats TICKET-BRANCH', async () => {
  const remoteBranchName = await createBranchName({
    ...ticketInfo,
    format: 'TICKET-BRANCH',
  })

  expect(remoteBranchName).toBe('ZACH-44-myBranch')
})

it('formats zp::TICKET::foo::BRANCH', async () => {
  const remoteBranchName = await createBranchName({
    ...ticketInfo,
    format: 'zp::TICKET::foo::BRANCH',
  })

  expect(remoteBranchName).toBe('zp::ZACH-44::foo::myBranch')
})

it('supports missing ticket prefix', async () => {
  const remoteBranchName = await createBranchName({
    ticketId: '44',
    format: 'BRANCH-TICKET',
  })

  expect(remoteBranchName).toBe('myBranch-44')
})

it('supports missing ticket ID', async () => {
  const remoteBranchName = await createBranchName({
    ticketPrefix: 'ZACH-',
    format: 'BRANCH-TICKET',
  })

  expect(remoteBranchName).toBe('myBranch')
})

it('supports missing both ticket prefix and ticket ID', async () => {
  expect(await createBranchName({format: 'BRANCH!!TICKET'})).toBe('myBranch')
  expect(await createBranchName({format: 'TICKET__BRANCH'})).toBe('myBranch')
  expect(await createBranchName({format: 'TICKET--BRANCH'})).toBe('myBranch')
  expect(await createBranchName({format: 'BRANCH'})).toBe('myBranch')
  expect(await createBranchName({format: 'TICKET'})).toBe('')
})
