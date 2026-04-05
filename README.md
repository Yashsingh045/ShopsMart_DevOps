# ShopSmart Web Application

ShopSmart is an e-commerce platform with a distinct frontend and backend architecture.

## Developer Environment Setup

To quickly get started with this repository, use the provided setup scripts.

### 1. Install Dependencies

Run the `dev-setup.sh` script to automatically detect and install Node.js dependencies for both the frontend (`client`) and backend (`server`) if they are missing.

```bash
./dev-setup.sh
```

### 2. Start the Services

You can use the native commands or the master service script.

**Using Master Service Script (Background Process):**
Start both frontend and backend automatically in the background:

```bash
./dev-services.sh start
```

To stop the services later, run:

```bash
./dev-services.sh stop
```

**Using Native Manual Commands:**
Open two terminal windows:

_Terminal 1 - Backend:_

```bash
cd server
npm run dev
```

_Terminal 2 - Frontend:_

```bash
cd client
npm run dev
```

## Project Architecture

ShopSmart follows a modern **Decoupled Client-Server Architecture**:

- **Frontend**: A high-performance React application built with Vite and styled using Tailwind CSS for full responsiveness.
- **Backend**: A RESTful API powered by Node.js and Express, using Prisma ORM for database management.
- **Database**: PostgreSQL (via Prisma) ensures robust and scalable relational data storage.
- **Communication**: Standard REST API calls using Axios from the client to the server.

## DevOps & CI/CD Workflow

### 1. Automation Scripts

- **`dev-setup.sh`**: An **idempotent** script that detects the environment and ensures all dependencies are installed without redundant operations.
- **`dev-services.sh`**: Orchestrates background process management using PID files, allowing for easy start/stop of the full stack.

### 2. GitHub Actions Pipeline

The repository uses a automated **Production CI Pipeline** (`.github/workflows/production-ci.yml`):

- **Linter Checks**: Ensures code quality via ESLint on every Pull Request.
- **Automated Testing**: Runs the test suite for both frontend and backend to prevent regressions.
- **Production Build**: Validates that the frontend builds correctly.
- **Automated Deployment**: On a successful `push` to the `main` branch, the code is automatically deployed to an **AWS EC2** instance via **SSH**, ensuring zero-downtime-like updates.

### 3. Dependency Management

- **Dependabot**: Configured to automatically check for and provide security updates for npm packages and GitHub Actions.
