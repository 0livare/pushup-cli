const {getConfig, defaultOptions} = require('./config')

jest.mock('cosmiconfig')
const cosmiConfig = require('cosmiconfig')
const search = jest.fn()
cosmiConfig.cosmiconfigSync.mockReturnValue({search})

process.cwd = jest.fn()

jest.mock('os')
const os = require('os')
os.homedir.mockReturnValue('/home')

const testConfig = {
  format: 'format',
  ticketPrefix: 'ticketPrefix',
  gitRemote: 'gitRemote',
  ticketUrl: 'ticketUrl',
  initials: 'zp',
}

function prefixObjectValues(object, prefix) {
  return Object.entries(object).reduce((accum, [key, val]) => {
    accum[key] = prefix + val
    return accum
  }, {})
}

const projectTestConfig = {
  ...testConfig,
  projects: {
    '/home/dev/project1': prefixObjectValues(testConfig, 'project1-'),
    '~/dev/project2': prefixObjectValues(testConfig, 'project2-'),
  },
}

function mockConfigFile(config) {
  search.mockReturnValueOnce({config, filepath: 'mock'})
}

function expectConfigsToMatch({expected, result}) {
  for (const key in defaultOptions) {
    if (expected[key] === undefined) continue
    expect(key + '__' + result[key]).toBe(key + '__' + expected[key])
  }
}

it('returns default options if none other are provided', async () => {
  mockConfigFile(null)
  const result = await getConfig({})

  expectConfigsToMatch({
    result,
    expected: defaultOptions,
  })
})

it('returns ticket cli option as ticketId when no config is found', async () => {
  mockConfigFile(null)
  const result = await getConfig({ticket: 1234})
  expect(result.ticketId).toBe(1234)
})

it('returns ticket cli option as ticketId when config is found', async () => {
  mockConfigFile(testConfig)
  const result = await getConfig({ticket: 1234})
  expect(result.ticketId).toBe(1234)
})

it('overrides defaults with config', async () => {
  mockConfigFile(testConfig)
  const result = await getConfig({})

  expectConfigsToMatch({
    result,
    expected: testConfig,
  })
})

it('overrides config with projects', async () => {
  mockConfigFile(projectTestConfig)
  process.cwd.mockReturnValue('/home/dev/project1')

  const result = await getConfig({})
  const configForProject = projectTestConfig.projects['/home/dev/project1']

  expectConfigsToMatch({
    result,
    expected: configForProject,
  })
})

it('maps "~" in a path to the user\'s home dir', async () => {
  mockConfigFile(projectTestConfig)
  // Note: "/home" here matches the value that was mocked
  // to the `os` module above.
  process.cwd.mockReturnValue('/home/dev/project2')

  const result = await getConfig({})
  const configForProject = projectTestConfig.projects['~/dev/project2']

  expectConfigsToMatch({
    result,
    expected: configForProject,
  })
})

it('resolves the correct project when cwd is a sub-directory', async () => {
  mockConfigFile(projectTestConfig)
  process.cwd.mockReturnValue('/home/dev/project1/foo/bar')

  const result = await getConfig({})
  const configForProject = projectTestConfig.projects['/home/dev/project1']

  expectConfigsToMatch({
    result,
    expected: configForProject,
  })
})

it('falls back to other config values if project is not present', async () => {
  mockConfigFile(projectTestConfig)
  process.cwd.mockReturnValue('~/dev/other-project')

  const result = await getConfig({})

  expectConfigsToMatch({
    result,
    expected: testConfig,
  })
})

it('overrides projects with CLI options', async () => {
  mockConfigFile(projectTestConfig)
  process.cwd.mockReturnValue('~/dev/project2')

  const cliOptions = Object.entries(testConfig).reduce((accum, [key, val]) => {
    accum[key] = 'cli-' + val
    return accum
  }, {})

  const result = await getConfig(cliOptions)

  expectConfigsToMatch({
    result,
    expected: cliOptions,
  })
})

it('passes through unknown CLI options', async () => {
  mockConfigFile(null)
  const result = await getConfig({}, {args: ['-f', '--zach']})

  expect(result.unknownOptions).toContain('-f')
  expect(result.unknownOptions).toContain('--zach')
})

it('fetches backup values from home config when project config is present', async () => {
  const testConfigNoInitials = {...testConfig}
  delete testConfigNoInitials.initials

  search.mockClear()
  mockConfigFile(testConfigNoInitials) // Project config
  mockConfigFile({initials: testConfig.initials}) // Home config

  const result = await getConfig({})

  expect(search).toHaveBeenCalledTimes(2)
  expect(result.initials).toBe(testConfig.initials)
})

it('overrides home config values with project config values when both are present', async () => {
  mockConfigFile(testConfig) // Project config
  mockConfigFile(prefixObjectValues(testConfig, 'home-')) // Home config

  const result = await getConfig({})

  expectConfigsToMatch({
    result,
    expected: testConfig,
  })
})
