# Maintaining the Papaya SDK

This document provides information for maintainers of the Papaya SDK package.

## GitHub Actions Workflows

The repository includes GitHub Actions workflows to automate testing and publishing:

### 1. Test Workflow

The `test.yml` workflow runs automatically on:
- Every push to the main/master branch
- Every pull request targeting the main/master branch
- Manual trigger via GitHub Actions UI

This workflow:
- Runs on multiple Node.js versions (16.x, 18.x)
- Installs dependencies
- Builds the package
- Runs tests
- Checks linting

### 2. Publish to npm Workflow

The `npm-publish.yml` workflow allows you to publish new versions of the package to npm. This workflow is **manually triggered** only.

To publish a new version:

1. Go to the "Actions" tab in the GitHub repository
2. Select the "Publish to npm" workflow
3. Click "Run workflow"
4. Configure the workflow:
   - **Version increment type**: Choose patch (0.0.X), minor (0.X.0), or major (X.0.0)
   - **Skip tests**: Option to skip running tests (not recommended for production releases)
   - **Custom version**: Optionally specify a custom version number (overrides version type)
5. Click "Run workflow" to start the publishing process

The workflow will:
- Check out the code
- Set up Node.js
- Install dependencies
- Run tests (unless skipped)
- Update version in package.json
- Build the package
- Publish to npm
- Commit and push the version changes
- Create a Git tag for the release

## Required Secrets

For the publishing workflow to work, you need to set up these repository secrets:

- `NPM_TOKEN`: An npm access token with publish permissions for the @papaya_fi organization

To add these secrets:
1. Go to your repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add the required secrets

## Manual Publishing

If you need to publish manually instead of using the GitHub Actions workflow, follow the steps in [documentation/publish.md](../documentation/publish.md). 