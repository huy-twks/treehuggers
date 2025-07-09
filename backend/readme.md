# Local Development

## Getting Started
1. Run `npm install`

2. Obtain the firebase service account key file from your peers and add it into `/config`

3. Use the `.env.template` file, rename the file to `.env`

4. Base64 encode the service account key file via `base64 ./config/serviceAccountKey.json`

5. Copy the base64 encoded string and put it into the environment variable `FIREBASE_SECRETS` located in `.env`

6. Run `npm run dev`

## Hints

If there are any missing packages identified, kindly install them.

# Homebrew (for macOS users)
`brew install git-secrets`

# Warning
You're not done yet! You MUST install the git hooks for every repo that you wish to use with git secrets --install.

Here's a quick example of how to ensure a git repository is scanned for secrets on each commit:

`cd /path/to/my/repo`

`git secrets --install`

`git secrets --register-aws`

use `git secrets --scan` to manually scan files, 
