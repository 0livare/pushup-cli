# pushy

Push a remote git branch based on a ticket number

## Getting Started

1. Create a configuration file (as described [below](#configuration-file))
1. Install dependencies with `yarn install`
1. Allow running "pushy" in the terminal to run this project `yarn link`
1. Run `pushy` in your terminal. You should get an error telling you to supply a ticket ID.
   1. If you get "permission denied" when running the `pushy` command, run `yarn execute` and try again.

## Configuration File

Pushy uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for configuration file support. This means you can configure Pushy via (in order of precedence):

- A `"pushy"` key in your `package.json` file.
- A `.pushyrc` file written in JSON or YAML.
- A `.pushyrc.json`, `.pushyrc.yml`, `.pushyrc.yaml`, or `.pushyrc.json5` file.
- A `.pushyrc.js`, `.pushyrc.cjs`, `pushy.config.js`, or `pushy.config.cjs` file that exports an object using `module.exports`.
- A `.pushyrc.toml` file.

Your configuration file may contain the following keys:

```json
{
  "ticketPrefix": "FOO",
  "ticketDivider": "-",
  "gitRemote": "origin",
  "developerInitials": "zp"
}
```
