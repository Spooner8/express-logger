# 🚀 Express Logger

Express Logger is a lightweight and efficient logging service for Express.js applications. It provides structured logging for HTTP requests and other application events, making it easier to debug and monitor your application.

## ✨ Features

- 📜 Logs HTTP requests with detailed information (method, URL, status code, response time, etc.)
- ⚙️ Customizable logging levels
- 🛠️ Easy integration with Express.js
- 🗂️ Supports JSON and plain text log formats
- 🐳 Dockerized for easy deployment

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Spooner8/express-logger
   cd express-logger
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🚀 Usage

1. Start the application:
   ```bash
   npm start
   ```

2. Access the application at `http://localhost:3001` (default port).

3. Logs will be generated for each HTTP request and can be viewed in the console or log files.

## ⚙️ Configuration

- **`src/router/logger.ts`**: Contains the main logging middleware.
- **`src/services/logger.ts`**: Handles log formatting and output.
- **`eslint.config.js`**: Linting configuration for consistent code style.
- **`tsconfig.json`**: TypeScript configuration.

## 🐳 Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t express-logger .
   ```

2. Run the container:
   ```bash
   docker-compose up
   ```

3. Access the application at `http://localhost:3001`.

## 🗂️ Project Structure

```
express-logger/
├── docker-compose.yaml   # Docker Compose configuration
├── Dockerfile            # Docker image configuration
├── eslint.config.js      # ESLint configuration
├── package.json          # Project metadata and dependencies
├── README.md             # Project documentation
├── tsconfig.json         # TypeScript configuration
└── src/                  # Application source code
    ├── app.ts           # Main application entry point
    ├── router/          # Express routers
    │   └── logger.ts    # Logging middleware
    └── services/        # Service modules
        ├── httpLogger.ts # HTTP-specific logging
        └── logger.ts    # General logging utilities
```

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
