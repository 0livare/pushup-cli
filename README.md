# pushy

Push a remote git branch based on a ticket number

## Getting Started

1. Create a configuration file (as described [below](#configuration-file))
1. Install dependencies with `yarn install`
1. Allow running "pushy" in the terminal to run this project `yarn link`
1. Run `pushy` in your terminal. You should get an error telling you to supply a ticket ID.
   1. If you get "permission denied" when running the `pushy` command, run `yarn execute` and try again.

## Configuration File

### Config file location

Pushy uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for configuration file support. This means you can configure Pushy via (in order of precedence):

- A `"pushy"` key in your `package.json` file.
- A `.pushyrc` file written in JSON or YAML.
- A `.pushyrc.json`, `.pushyrc.yml`, `.pushyrc.yaml`, or `.pushyrc.json5` file.
- A `.pushyrc.js`, `.pushyrc.cjs`, `pushy.config.js`, or `pushy.config.cjs` file that exports an object using `module.exports`.
- A `.pushyrc.toml` file.

### Config file contents

Your configuration file may contain the following keys:

- `format` (default: `TICKET-BRANCH`) - The format of the remote branch to be pushed. Can optionally accept certain placeholders that will be replaced with calculated values. All text that does not match a placeholder will not be modified and will become part of the remote branch name.

  The supported placeholders are:

  - `TICKET`: Will be replaced with the parsed ticket number
  - `BRANCH`: Will be replaced with the name of your currently checked out local branch

- `ticketPrefix` (default: `""`) - The alphabetic prefix that should be appended to ticket ID's. For example, if this is set to `FOO-`, the command `pushy 44` will result in BRANCH (one of the `format` placeholders) being equal to `FOO-44`.

  If you want the alphabetic portion of the ticket number to be separated from the numeric portion, your `ticketPrefix` must end with that divider, for example a dash `-` as shown in the previous example.

  This prefix can also be supplied directly to the `pushy` command: `pushy BAR-123`. Doing so will cause `ticketPrefix` to be ignored.

- `gitRemote` (default: `origin`) - The name of the git remote that should be pushed to.
