# pushy

Push a remote git branch based on a ticket number

## Getting Started

1. Duplicate `config-SAMPLE.json` and rename it to `config.json`. Update its values to suit your needs.
1. Install dependencies `yarn install`
1. Allow running "uno" in the terminal to run this project `yarn link`
1. Run `pushy` in your terminal, should get an error telling you to supply a ticket ID.
   1. If you get "permission denied" when running the `pushy` command, run `yarn execute`.
