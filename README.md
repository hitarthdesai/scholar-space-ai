# Capstone Project

## Local Setup (for Mac)

1. Clone this repository using the following:

```bash
cd ~/dev
git clone https://github.com/hitarthdesai/capstone-project.git
cd capstone-project
```

2. Install nodenv

```bash
brew install nodenv
nodenv init
```

3. Install node (it will read the .node-version in our repo as source of truth)

```bash
nodenv install
```

4. Install dependencies

```bash
npm i
```

5. Get environment variables

We need `DATABASE_URL` and `AUTH_RESEND_KEY` variables to run log in to the app.
Ask Hitarth for them.
