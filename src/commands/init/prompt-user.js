const fs = require('fs')
const os = require('os')
const inquirer = require('inquirer')
const chalk = require('chalk')
const removeEmptyConfigValues = require('./remove-empty-config-values')
const {getGitRemotes, resolveHomePath} = require('../../util')

const textEntryPoint = chalk.blue('--> ')

async function promptUser({cwd, options}) {
  const {fileLocation} = await inquirer.prompt([
    {
      name: 'fileLocation',
      type: 'list',
      message: `Where do you want to put your config file?`,
      choices: [
        {name: `This directory (${cwd})`, value: cwd},
        {name: 'Your home directory', value: os.homedir()},
      ],
    },
  ])

  if (fileLocation !== os.homedir()) {
    return standardPrompt()
  }

  const {addProjects} = await inquirer.prompt([
    {
      name: 'addProjects',
      type: 'confirm',
      message: `Do you need to support multiple projects from this single config?`,
    },
  ])

  if (!addProjects) {
    return standardPrompt()
  }

  let defineMoreProjects = true
  const projects = {}

  while (defineMoreProjects) {
    const {projectPath} = await inquirer.prompt([
      {
        name: 'projectPath',
        type: 'input',
        message: `What's the path to this project?\n${textEntryPoint}`,
        validate(enteredProjectPath) {
          const pathWithoutTilde = resolveHomePath(enteredProjectPath)
          return !enteredProjectPath || fs.existsSync(pathWithoutTilde)
            ? true
            : 'The path must exist'
        },
      },
    ])

    if (!projectPath) {
      defineMoreProjects = false
      break
    }

    const projectConfig = await promptForConfig({
      cwd: projectPath,
      options,
      projectSuffix: chalk.yellow(` for ${projectPath}`),
    })

    const {anotherProject} = await inquirer.prompt([
      {
        name: 'anotherProject',
        type: 'confirm',
        message: `Do you want to define another project configuration?`,
      },
    ])

    projects[projectPath] = projectConfig
    defineMoreProjects = anotherProject
  }

  const {supplyDefault} = await inquirer.prompt([
    {
      name: 'supplyDefault',
      type: 'confirm',
      message: `Do you want to define default config values for other projects?`,
    },
  ])

  let defaultConfig = {}
  if (supplyDefault) {
    defaultConfig = await promptForConfig({
      options,
      projectSuffix: chalk.yellow(` for other projects (the default)`),
    })
  }

  removeEmptyConfigValues(defaultConfig)
  Object.values(projects).forEach(removeEmptyConfigValues)

  return {
    fileLocation,
    ...defaultConfig,
    projects,
  }

  async function standardPrompt() {
    const config = await promptForConfig({
      cwd,
      options,
      projectSuffix: '',
    })
    return {fileLocation, ...config}
  }
}

async function promptForConfig({cwd, options, projectSuffix}) {
  const gitRemotes = cwd && (await getGitRemotes(cwd))

  // prettier-ignore
  const answers = await inquirer.prompt([
    {
      name: 'format',
      type: 'input',
      message: [
        `What do you want the format of your remote branches to be${projectSuffix}?`,
        chalk.gray('  Use TICKET as a placeholder for your ticket number (optional)'),
        chalk.gray('  Use BRANCH as a placeholder for your local branch name (optional)'),
        chalk.gray('  Use INITIALS as a placeholder for your name\'s initials (optional)'),
        textEntryPoint,
      ].join('\n'),
      when: !options.format,
    },
    {
      name: 'initials',
      type: 'input',
      message: `What are the initials for your name?\n${textEntryPoint}`,
      when: answers => !options.initials && answers.format.includes('INITIALS')
    },
    {
      name: 'ticketPrefix',
      type: 'input',
      message: [
        `What is the prefix on your ticket numbers${projectSuffix}?`, 
        chalk.gray('  Be sure to include a dash or other divider if it exists'), 
        textEntryPoint,
      ].join('\n'),
      when: answers => !options.ticketPrefix && answers.format.includes('TICKET'),
    },
    {
      name: 'gitRemote',
      type: gitRemotes ? 'list' : 'input',
      message: `Which git remote should branches be pushed to by default${projectSuffix}?${gitRemotes ? '' : `\n${textEntryPoint}`}`,
      choices: gitRemotes,
      when: !gitRemotes || gitRemotes.length > 1 && !options.gitRemote,
    },
    {
      name: 'ticketUrl',
      type: 'input',
      message: [
        `What is the URL of a ticket in your ticketing system${projectSuffix}?`,
        chalk.gray('  Use TICKET as a placeholder for the ticket number'),
        textEntryPoint,
      ].join('\n'),
      when: !options.ticketUrl,
      validate(enteredTicketUrl) {
        if (enteredTicketUrl && !enteredTicketUrl.includes('TICKET')) {
          return 'Your ticket URL must include "TICKET" as a placeholder for the ticket number'
        }
        if (enteredTicketUrl && !enteredTicketUrl.startsWith('http')) {
          return 'Your ticket URL must start with "http"'
        }

        return true
      }
    },
  ])

  return {
    ...answers,
    gitRemote: options.gitRemote || answers.gitRemote || gitRemotes[0],
  }
}

module.exports = {promptUser, textEntryPoint}
