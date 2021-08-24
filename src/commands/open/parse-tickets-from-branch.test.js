const parseTicketsFromBranch = require('./parse-tickets-from-branch')

it('finds a ticket prefix', () => {
  const result = parseTicketsFromBranch({
    ticketPrefix: 'ZACH-',
    branch: 'zp-ZACH-123',
  })

  expect(result).toHaveLength(1)
  expect(result).toContain('ZACH-123')
})

it('finds multiple ticket prefixes', () => {
  const result = parseTicketsFromBranch({
    ticketPrefix: 'ZACH-',
    branch: 'zp-ZACH-123__asdf$$ZACH-987',
  })

  expect(result).toHaveLength(2)
  expect(result).toContain('ZACH-123')
  expect(result).toContain('ZACH-987')
})

it('finds a lone number when no prefix is present', () => {
  const result = parseTicketsFromBranch({
    ticketPrefix: 'ZACH-',
    branch: 'zp-444!!foo',
  })

  expect(result).toHaveLength(1)
  expect(result).toContain('444')
})

it('finds multiple lone numbers when no prefix is present', () => {
  const result = parseTicketsFromBranch({
    ticketPrefix: 'ZACH-',
    branch: 'zp--123987987__asdf$$ZACH-ss7778987fd',
  })

  expect(result).toHaveLength(2)
  expect(result).toContain('123987987')
  expect(result).toContain('7778987')
})

it('ignores lone numbers when a prefix is present', () => {
  const result = parseTicketsFromBranch({
    ticketPrefix: 'ZACH-',
    branch: 'zp--123987987__asdf$$ZACH-444ZACH-ss7778987fd',
  })

  expect(result).toHaveLength(1)
  expect(result).toContain('ZACH-444')
})

it('returns an array when no branch was passed', () => {
  let result = parseTicketsFromBranch({
    ticketPrefix: 'ZACH-',
    branch: '',
  })
  expect(Array.isArray(result)).toBe(true)

  result = parseTicketsFromBranch({
    ticketPrefix: 'ZACH-',
    branch: null,
  })
  expect(Array.isArray(result)).toBe(true)

  result = parseTicketsFromBranch({
    ticketPrefix: 'ZACH-',
  })
  expect(Array.isArray(result)).toBe(true)
})

it('returns an array when no ticket prefix was passed', () => {
  let result = parseTicketsFromBranch({
    ticketPrefix: '',
    branch: 'asdf',
  })
  expect(Array.isArray(result)).toBe(true)

  result = parseTicketsFromBranch({
    ticketPrefix: null,
    branch: 'asdf',
  })
  expect(Array.isArray(result)).toBe(true)

  result = parseTicketsFromBranch({
    branch: 'asdf',
  })
  expect(Array.isArray(result)).toBe(true)
})

it('returns an array when no ticket prefix or branch was passed', () => {
  let result = parseTicketsFromBranch({
    ticketPrefix: '',
    branch: '',
  })
  expect(Array.isArray(result)).toBe(true)

  result = parseTicketsFromBranch({
    ticketPrefix: null,
    branch: null,
  })
  expect(Array.isArray(result)).toBe(true)

  result = parseTicketsFromBranch({})
  expect(Array.isArray(result)).toBe(true)
})
