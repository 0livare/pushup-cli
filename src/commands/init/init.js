const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const emoji = require('node-emoji')
const {error} = require('../../util')

const checkForExistingConfig = require('./check-for-existing-config')
const removeEmptyConfigValues = require('./remove-empty-config-values')
const {promptUser} = require('./prompt-user')

async function init(options) {
  await checkForExistingConfig()

  const userAnswers = await promptUser({cwd: process.cwd(), options})
  const {fileLocation, projects} = userAnswers

  const finalConfigValues = {
    ...userAnswers,
    ...options,
    projects,
  }

  removeEmptyConfigValues(finalConfigValues)

  if (!Object.keys(finalConfigValues).length) {
    error('No valid config values were supplied, not creating a config')
    process.exit(0)
  }

  const configFilePath = path.resolve(fileLocation, '.pushuprc.json')
  fs.writeFileSync(configFilePath, JSON.stringify(finalConfigValues, null, 2))

  console.log(
    emoji.get('white_check_mark') +
      ' ' +
      chalk.green(`Successfully wrote ${configFilePath}`),
  )
}

module.exports = init
