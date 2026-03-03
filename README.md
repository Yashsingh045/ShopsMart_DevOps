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

*Terminal 1 - Backend:*
```bash
cd server
npm run dev
```

*Terminal 2 - Frontend:*
```bash
cd client
npm run dev
```

## DevOps Automation

This repository includes several DevOps utilities:
- **`dev-services.sh`**: A bash script to orchestrate background start/stop of Node services using PID management.
- **`dev-setup.sh`**: An idempotent script to automate `npm install` gracefully.
- **`.github/workflows`**: Includes Basic (`integration.yml`) and Production (`production-ci.yml`) CI pipelines for automated linting, testing, and building.
