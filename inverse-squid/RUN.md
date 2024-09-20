# Subsquid Indexer

This README provides instructions on how to set up and run our Subsquid indexer.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js v16 or newer
- Git
- Docker
- Subsquid CLI (install with `npm i -g @subsquid/cli@latest`)

## Setup and Running Instructions

Follow these steps to run the indexer:

1. Clone the repository and navigate to the project directory.

2. Install dependencies:

   ```
   npm install
   ```

3. Navigate to the `inverse-squid` directory:

   ```
   cd inverse-squid
   ```

4. Create a `.env` file from the example and set the `RPC_ETH_HTTP` variable:

   ```
   cp .env.example .env
   ```

   Open the `.env` file and set the `RPC_ETH_HTTP` variable to your EVM RPC endpoint.

5. Install additional dependencies:

   ```
   npm install
   ```

6. Start the Docker services:

   ```
   docker compose up -d
   ```

7. Build the project:

   ```
   npm run build
   ```

8. Generate and apply database migrations:

   ```
   npx squid-typeorm-migration generate
   npx squid-typeorm-migration apply
   ```

9. Start the indexer:

   ```
   node -r dotenv/config lib/main.js
   ```

10. In a second terminal, start the GraphQL server:

    ```
    npx squid-graphql-server
    ```

11. Open your browser and navigate to `http://localhost:4350/graphql` to access the GraphQL playground.
