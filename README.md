# pushup-cli 💪

Automatically push remote git branches that follow your team's standard.

## Why

Teams often create rules about the format of their branch names. The goal is usually to be able to identify who created the branch, or to be able to correlate the branch with a ticket number in your ticketing system (e.g. Jira). For example:

```bash
zp/my-branch # Where zp are someone's initials
MLD-419-add-graphql-support # Where MLD-419 is a ticket number
zp-NVM-8907-supportAdditionalProviders
```

To follow this standard, devs will often create a local branch in that format and then just push it up like normal. But as you've probably found (if you've made your way here), that method has some drawbacks:

- It's super repetitive
- For some reason it's always harder than it should be to remember the damn format you're supposed to use
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

pushup uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig#cosmiconfig) for configuration file support. This means you can configure pushup via [any standard configuration method](https://github.com/davidtheclark/cosmiconfig#cosmiconfig).

You can place your config file directly in your project so that your whole team can take advantage of it, or in your home directory for your personal use.

Placing the config directly in the project is nice because that allows customizing the ticket prefix on a per-project basis. You can also customize config options via the [CLI options](#CLI-Options).

### Config file contents

Your configuration file may contain the following keys:

- `format` _(default: `TICKET-BRANCH`)_ - The format of the remote branch name to be pushed. It can optionally accept certain placeholders that will be replaced with calculated values. All text that does not match a placeholder will not be modified and will become part of the remote branch name.

  The currently supported placeholders are:

  - `TICKET`: Will be replaced with the parsed ticket number
  - `BRANCH`: Will be replaced with the name of your currently checked out local branch

  Here are some example formats:

  ```
  zp/BRANCH
  TICKET-BRANCH
  zp-TICKET-BRANCH
  ```

- `ticketPrefix` _(default: `""`)_ - The alphabetic prefix that should be appended to ticket IDs. For example, if this is set to `FOO-`, the command `pushup 44` will result in BRANCH (one of the `format` placeholders) being equal to `FOO-44`.

  If you want the alphabetic portion of the ticket number to be separated from the numeric portion, your `ticketPrefix` must end with that divider, for example a dash `-` as shown in the previous example.

  This prefix can also be supplied directly to the `pushup` command: `pushup BAR-123`. Doing so will cause `ticketPrefix` to be ignored.

- `gitRemote` _(default: `origin`)_ - The name of the git remote that should be pushed to.

## CLI Options

As stated above, the simplest usage of the CLI is just `pushup 44`, where `44` is your ticket identifier. This wil be combined with either your configuration file or the default options to publish a remote branch.

All configuration options also have an identically named CLI flag. If both are present, the CLI flag will take precedence. Please see the [config file contents](#config-file-contents) section for more information about each option.

- `--format`
- `--ticketPrefix`, `-p`
- `--gitRemote`, `-r`

Finally, you prefer passing flags to positional arguments because they're better labeled, there are also the `--ticket` or `-t` flags to pass the ticket identifier.

Any unknown options will be passed along to `git`.

## Running locally

1. Create a configuration file (as described [above](#configuration-file))
1. Install dependencies with `yarn install`
1. Allow running `pushup`in the terminal to run this project `yarn link`
1. Run `pushup` in your terminal. You should get an error telling you to supply a ticket ID.
   1. If you get "permission denied" when running the `pushup` command, run `yarn execute` and try again.
