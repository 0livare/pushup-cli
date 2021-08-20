# pushup-cli 💪

Automatically push remote git branches that follow your team's standard.

## Why

Teams often create rules about the format of their branch names. The goal is usually to be able to identify who created the branch, or to be able to correlate the branch with a ticket number in your ticketing system (e.g. Jira). For example:

```bash
zp/my-branch # Where zp are someone's initials
MLD-419-add-graphql-support # Where MLD-419 is a ticket number
zp-NVM-8907-supportAdditionalProviders
```

To follow this standard, devs will often create a local branch in that format and then just push it up like normal. But as you've probably found (if you've made your way to this page), that method has some drawbacks.

- It's super repetitive
- For some reason it's always harder than it should be to remember the damn format
- Your branch names become so long and a pain to type
- Even terminal auto-complete can't help very much because the repetitive part of the branch name tends to be at the beginning, and for auto-complete to work you at least have to type it out until you get to a unique portion of the branch name.

**pushup-cli** solves that problem by allowing you to create a simple description branch name, and automatically publishing a remote branch name that meets your teams standards.

## Getting Started

Install `pushup` globally with either npm or yarn:

```bash
# Install with NPM
npm i -g pushup-cli

# Or install with yarn
yarn global add pushup-cli
```

And then create a [configuration file](#configuration-file).

Now pushing a remote branch is as simple as

```bash
➜  git checkout -b myBranch
Switched to a new branch 'myBranch'

➜  pushup 123 # Where 123 is your ticket number
Branch 'myBranch' set up to track remote branch 'zp-NVM-123-myBranch' from 'origin'.
```

## Configuration File

### Config file location

pushup uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for configuration file support. This means you can configure pushup via (in order of precedence):

- A `"pushup"` key in your `package.json` file.
- A `.pushuprc` file written in JSON or YAML.
- A `.pushuprc.json`, `.pushuprc.yml`, `.pushuprc.yaml`, or `.pushuprc.json5` file.
- A `.pushuprc.js`, `.pushuprc.cjs`, `pushup.config.js`, or `pushup.config.cjs` file that exports an object using `module.exports`.
- A `.pushuprc.toml` file.

You can place your config file directly in your project so that your whole team can take advantage of it, or in your home directory for your personal use.

Placing the config directly in the project is nice because that allows customizing the ticket prefix on a per-project basis.

### Config file contents

Your configuration file may contain the following keys:

- `format` (default: `TICKET-BRANCH`) - The format of the remote branch to be pushed. Can optionally accept certain placeholders that will be replaced with calculated values. All text that does not match a placeholder will not be modified and will become part of the remote branch name.

  The currently supported placeholders are:

  - `TICKET`: Will be replaced with the parsed ticket number
  - `BRANCH`: Will be replaced with the name of your currently checked out local branch

  Here are some example formats:

  ```
  zp/BRANCH
  TICKET-BRANCH
  zp-TICKET-BRANCH
  ```

- `ticketPrefix` (default: `""`) - The alphabetic prefix that should be appended to ticket ID's. For example, if this is set to `FOO-`, the command `pushup 44` will result in BRANCH (one of the `format` placeholders) being equal to `FOO-44`.

  If you want the alphabetic portion of the ticket number to be separated from the numeric portion, your `ticketPrefix` must end with that divider, for example a dash `-` as shown in the previous example.

  This prefix can also be supplied directly to the `pushup` command: `pushup BAR-123`. Doing so will cause `ticketPrefix` to be ignored.

- `gitRemote` (default: `origin`) - The name of the git remote that should be pushed to.

## Running locally

1. Create a configuration file (as described [above](#configuration-file))
1. Install dependencies with `yarn install`
1. Allow running `pushup`in the terminal to run this project `yarn link`
1. Run `pushup` in your terminal. You should get an error telling you to supply a ticket ID.
   1. If you get "permission denied" when running the `pushup` command, run `yarn execute` and try again.
