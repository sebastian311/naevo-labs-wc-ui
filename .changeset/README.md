# Changesets

Each change to a publishable package gets a small markdown file in this folder, created with `npm run changeset`.
It records which packages changed, the semver bump (patch / minor / major) and a human-readable summary.

On release, `npm run version-packages` consumes these files: bumps versions, updates dependent packages
and writes each package's CHANGELOG.md. `npm run release` then builds and publishes to npm.
