const {getConfig, defaultOptions} = require('./config')

jest.mock('cosmiconfig')
const cosmiConfig = require('cosmiconfig')

jest.mock('./util')
const util = require('./util')

jest.mock('os')
const os = require('os')
os.homedir.mockReturnValue('/home')

const testConfig = {
  format: 'format',
  ticketPrefix: 'ticketPrefix',
  gitRemote: 'gitRemote',
  ticketUrl: 'ticketUrl',
}
const projectTestConfig = {
  ...testConfig,
  projects: {
    '/home/dev/project1': Object.entries(testConfig).reduce(
      (accum, [key, val]) => {
        accum[key] = 'project1-' + val
        return accum
      },
      {},
    ),
    '~/dev/project2': Object.entries(testConfig).reduce((accum, [key, val]) => {
      accum[key] = 'project2-' + val
      return accum
    }, {}),
  },
}

function mockConfigFile(config) {
  cosmiConfig.cosmiconfigSync.mockReturnValueOnce({
    search: () => ({config}),
  })
}

it('returns default options if none other are provided', async () => {
  mockConfigFile(null)
  const result = await getConfig({})

  for (const key in defaultOptions) {
    expect(result[key]).toBe(defaultOptions[key])
  }
})

it('returns ticket cli option as ticketId', async () => {
  mockConfigFile(null)
  const result = await getConfig({ticket: 1234})
  expect(result.ticketId).toBe(1234)
})

it('overrides defaults with config', async () => {
  mockConfigFile(testConfig)
  const result = await getConfig({})

  for (const key in defaultOptions) {
    expect(result[key]).toBe(testConfig[key])
  }
})

it('overrides config with projects', async () => {
  mockConfigFile(projectTestConfig)
  util.getCwd.mockResolvedValueOnce('/home/dev/project1')

  const result = await getConfig({})
  const configForProject = projectTestConfig.projects['/home/dev/project1']

  for (const key in defaultOptions) {
    expect(result[key]).toBe(configForProject[key])
  }
})

it('maps "~" in a path to the user\'s home dir', async () => {
  mockConfigFile(projectTestConfig)
  // Note: "/home" here matches the value that was mocked
  // to the `os` module above.
  util.getCwd.mockResolvedValueOnce('/home/dev/project2')

  const result = await getConfig({})
  const configForProject = projectTestConfig.projects['~/dev/project2']

  for (const key in defaultOptions) {
    expect(result[key]).toBe(configForProject[key])
  }
})

it('resolves the correct project when cwd is a sub-directory', async () => {
  mockConfigFile(projectTestConfig)
  util.getCwd.mockResolvedValueOnce('/home/dev/project1/foo/bar')

  const result = await getConfig({})
  const configForProject = projectTestConfig.projects['/home/dev/project1']

  for (const key in defaultOptions) {
    expect(result[key]).toBe(configForProject[key])
  }
})

it('falls back to other config values if project is not present', async () => {
  mockConfigFile(projectTestConfig)
  util.getCwd.mockResolvedValueOnce('~/dev/other-project')

  const result = await getConfig({})

  for (const key in defaultOptions) {
    expect(result[key]).toBe(testConfig[key])
  }
})

it('overrides projects with CLI options', async () => {
  mockConfigFile(projectTestConfig)
  util.getCwd.mockResolvedValueOnce('~/dev/project2')

  const cliOptions = Object.entries(testConfig).reduce((accum, [key, val]) => {
    accum[key] = 'cli-' + val
    return accum
  }, {})

  const result = await getConfig(cliOptions)

  for (const key in defaultOptions) {
    expect(result[key]).toBe(cliOptions[key])
  }
})

it('passes through unknown CLI options', async () => {
  mockConfigFile(null)
  const result = await getConfig({}, {args: ['-f', '--zach']})

  expect(result.unknownOptions).toContain('-f')
  expect(result.unknownOptions).toContain('--zach')
})
