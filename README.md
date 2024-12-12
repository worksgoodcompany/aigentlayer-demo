# AIGENTLAYER – Autonomous AI Agent for EigenLayer Restaking

## Description

AIGENTLAYER is an open-source project that aims to simplify interaction with EigenLayer's restaking capabilities. Instead of learning complex commands or navigating multiple interfaces, you can just tell AIGENT what you want in plain English.

## Key Features (Current)

- **Deposit ETH into EigenLayer:** Request a deposit, and AIGENT will handle the transaction.
- **Fetch Staked Balances:** Quickly check how much ETH you have staked.
- **GaiaNet Integration:** AIGENT uses GaiaNet as its default AI LLM API.

## Roadmap (Ideal Features)

- **Claim Rewards:** Automatically claim staking rewards.
- **Withdraw & Redelegate:** Manage your staking positions effortlessly.
- **EigenExplorer Integration:** Gain real-time insights and data from the EigenLayer ecosystem.
- **Advanced Evaluators:** Intelligent decision-making—AIGENT can suggest when to restake, claim, or withdraw based on market conditions.

## Tech Stack

- **Framework:** ai16z Eliza
- **Languages:** Primarily TypeScript (Node.js, pnpm). Some Python if needed for auxiliary tasks.
- **Architecture:** Modular monorepo allowing for easy extension of actions, providers, and evaluators.

## GaiaNet Integration

AIGENTLAYER uses GaiaNet as its default AI LLM API. This integration simplifies how the agent interprets natural language, offering scalable and reliable language processing to power its autonomous actions. By building on GaiaNet’s infrastructure, we also align with the Gaia Agent Infrastructure Challenge criteria, demonstrating how integrating GaiaNet’s capabilities can enhance agent performance and contribute to the Gaia ecosystem’s growth.

## Project Structure

Key files and folders:

```
.
├── assets/                             # Assets
├── docs/                               # Documentation
├── eliza/                              # The AI Agent Folder
│   ├── agent/                          # The AI Agent
│   ├── characters/                     # Characters Folder
│   │   └── aigent.character.json       # Character file
│   ├── packages/                       # Packages Folder
│   │   ├── plugin-eigenlayer/          # Custom plugin for EigenLayer
│   │   └── client/                     # Web Client
└── README.md                           # This file
```

## Setup Instructions

### Clone this Repository

```bash
git clone https://github.com/worksgoodcompany/aigentlayer.git
```

### Running AIGENT

1. **Move to agent folder**
```bash
cd eliza
```

2. **Install Dependencies**
```bash
pnpm install
```

3. **Copy the .env.example file and rename it to .env**
```bash
cp .env.example .env
```

4. **Configure Environment**

Edit .env and add your values:

```env
# Suggested quickstart environment variables

# For Discord integration
DISCORD_APPLICATION_ID=  # For Discord integration
DISCORD_API_TOKEN=      # Bot token

# For Twitter integration
TWITTER_USERNAME=       # Account username
TWITTER_PASSWORD=       # Account password
TWITTER_EMAIL=         # Account email

# For Telegram integration
TELEGRAM_BOT_TOKEN=

# For OpenAI API
OPENAI_API_KEY=        # OpenAI API key

# For Grok API
GROK_API_KEY=          # Grok API key

# For Anthropic API
ANTHROPIC_API_KEY=     # Anthropic API key

# For OpenRouter API
OPENROUTER_API_KEY=
OPENROUTER_MODEL=      # Default: uses hermes 70b/405b

# Gaianet Configuration
GAIANET_MODEL=
GAIANET_SERVER_URL=

SMALL_GAIANET_MODEL=        # Default: llama3b
SMALL_GAIANET_SERVER_URL=   # Default: https://llama3b.gaia.domains/v1

MEDIUM_GAIANET_MODEL=       # Default: llama
MEDIUM_GAIANET_SERVER_URL=  # Default: https://llama8b.gaia.domains/v1

LARGE_GAIANET_MODEL=        # Default: qwen72b
LARGE_GAIANET_SERVER_URL=   # Default: https://qwen72b.gaia.domains/v1

GAIANET_EMBEDDING_MODEL=
USE_GAIANET_EMBEDDING=      # Set to TRUE for GAIANET/768, leave blank for local

# For EVM
EVM_PRIVATE_KEY=
INFURA_API_KEY=
```

5. **Configure the character file**

Set up the clients you want to use and the AI model provider
```
"name": "AIGENT",                                       # Change this to your desired name.
    "plugins": [],
    "clients": ["discord", "twitter", "telegram"],      # Remove the ones you don't need.
    "modelProvider": "gaianet",                         # You can replace this with "openai", "openrouter" or others.
```

6. **Build the Agent**
```bash
pnpm build
```

7. **Run the Agent**
```bash
pnpm run start --characters="characters/aigent.character.json"
```

### Running the Web Client

1. **Move to client folder**
```bash
cd client
# or
cd eliza/client
```

2. **Run the client**
```bash
pnpm run dev
```

3. **Access the client**
You can access the client using a web browser at:
http://localhost:5173/

## Interacting with AIGENT

- Via web: Open the provided local URL in your browser.
- Via Telegram, Discord, or Twitter: Follow the instructions in `docs/clients.md` (to be created).

### Usage Examples

- **Deposit:** "AIGENT, deposit 0.1 ETH into EigenLayer."
- **Check Balance:** "AIGENT, what's my staked ETH balance?"

## Contributing

We welcome contributions! Submit pull requests for bug fixes, feature enhancements, or new evaluators.

## License

MIT License