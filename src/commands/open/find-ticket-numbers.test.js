const findTicketNumbers = require('./find-ticket-numbers')
const {getCurrentRemoteTrackingBranch} = require('../../util')

jest.mock('../../util', () => {
  const actualUtil = jest.requireActual('../../util')

  return {
    ...actualUtil,
    getCurrentRemoteTrackingBranch: jest.fn(),
  }
})

beforeEach(() => {
  // This is the default branch name if mockResolvedValueOnce()
  // is not called in a particular test
  getCurrentRemoteTrackingBranch.mockResolvedValue('myBranch')
})

it('finds prefixed ticket number in remote branch name', async () => {
  getCurrentRemoteTrackingBranch.mockResolvedValueOnce('zp-ZACH-123__foo')

  const result = await findTicketNumbers({ticketPrefix: 'ZACH-'})
  expect(result).toHaveLength(1)
  expect(result).toContain('ZACH-123')
})

it('finds multiple prefixed ticket numbers in remote branch name', async () => {
  getCurrentRemoteTrackingBranch.mockResolvedValueOnce(
    'zp-ZACH-123__fooZACH-999',
  )

  const result = await findTicketNumbers({ticketPrefix: 'ZACH-'})
  expect(result).toHaveLength(2)
  expect(result).toContain('ZACH-123')
  expect(result).toContain('ZACH-999')
})

it('finds prefixed ticket number for numeric input', async () => {
  const result = await findTicketNumbers({
    ticketPrefix: 'ZACH-',
    ticketId: '444',
  })

  expect(result).toHaveLength(1)
  expect(result).toContain('ZACH-444')
})

it('finds prefixed ticket number for prefixed input', async () => {
  const result = await findTicketNumbers({
    ticketPrefix: 'ZACH-',
    ticketId: 'ZACH-666',
  })

  expect(result).toHaveLength(1)
  expect(result).toContain('ZACH-666')
})

it('ignores remote branch when prefix is found in numeric input', async () => {
  getCurrentRemoteTrackingBranch.mockResolvedValueOnce('ZACH-123')

  const result = await findTicketNumbers({
    ticketPrefix: 'ZACH-',
    ticketId: '444',
  })

  expect(result).toHaveLength(1)
  expect(result).toContain('ZACH-444')
})

it('ignores remote branch when prefix is found in prefixed input', async () => {
  getCurrentRemoteTrackingBranch.mockResolvedValueOnce('ZACH-123')

  const result = await findTicketNumbers({
    ticketPrefix: 'ZACH-',
    ticketId: 'ZACH-999',
  })

  expect(result).toHaveLength(1)
  expect(result).toContain('ZACH-999')
})

it('returns an array when no prefixed ticket is found in inputs or branch', async () => {
  const result = await findTicketNumbers({
    ticketPrefix: 'ZACH-',
  })

  expect(Array.isArray(result)).toBe(true)
  expect(result).toHaveLength(0)
})

it('ignores lone numbers in the branch name when a prefix is present', async () => {
  getCurrentRemoteTrackingBranch.mockResolvedValueOnce('zp-123__456')

  const result = await findTicketNumbers({
    ticketPrefix: 'ZACH-',
  })

  expect(Array.isArray(result)).toBe(true)
  expect(result).toHaveLength(0)
})

it('finds lone numbers in the branch name when no prefix is present', async () => {
  getCurrentRemoteTrackingBranch.mockResolvedValueOnce('zp-123__456')

  const result = await findTicketNumbers({})

  expect(result).toHaveLength(2)
  expect(result).toContain('123')
  expect(result).toContain('456')
})
