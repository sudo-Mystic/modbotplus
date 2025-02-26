# Reddit Moderation Bot

This project is a Reddit moderation bot with a web dashboard that allows users to customize moderation actions using "if this then that" (IFTTT) logic. The bot is designed to be efficient and performant, adhering to good coding practices.

## Features

- **Reddit API Integration**: The bot interacts with the Reddit API to perform moderation tasks such as banning users and removing posts.
- **Customizable Actions**: Users can define rules that specify actions to take based on certain conditions.
- **Web Dashboard**: A user-friendly web interface for managing moderation rules and actions.
- **Authentication**: Secure login and logout functionality for the web dashboard.
- **Logging**: Structured logging for monitoring and debugging purposes.

## Project Structure

- `src/`: Contains the source code for the bot and web server.
  - `bot/`: Implements the moderation bot functionality.
    - `index.ts`: Entry point for the bot.
    - `reddit-client.ts`: Handles Reddit API interactions.
    - `rules-engine.ts`: Processes IFTTT rules.
  - `web/`: Implements the web server and dashboard.
    - `index.ts`: Entry point for the web server.
    - `routes/`: Defines API and dashboard routes.
    - `controllers/`: Manages rules and actions.
    - `middleware/`: Contains authentication middleware.
    - `views/`: Frontend templates for the dashboard.
  - `shared/`: Contains shared utilities, types, and database models.
    - `types/`: Defines TypeScript interfaces for rules and actions.
    - `db/`: Initializes the database connection.
    - `utils/`: Provides utility functions such as logging and configuration.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd reddit-mod-bot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

4. Start the bot and web server:
   ```
   npm run start
   ```

## Usage

- Access the web dashboard at `http://localhost:3000`.
- Use the dashboard to create and manage moderation rules and actions.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.