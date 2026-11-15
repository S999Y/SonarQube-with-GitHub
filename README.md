# Assignment 16 - SonarQube with GitHub Actions

Sample JavaScript (Node.js) project analyzed by SonarQube on every push through GitHub Actions.

## Structure

```
.
├── .github/workflows/sonarqube.yml
├── docker-compose.yml
├── sonar-project.properties
├── src/
│   ├── calculator.js
│   └── index.js
└── test/calculator.test.js
```

## Local usage

```bash
npm install
npm test
npm start
```

## SonarQube server with ngrok

1. Copy `.env.example` to `.env` and add your ngrok authtoken.
2. Start the stack:

```bash
docker compose up -d
```

3. Open SonarQube at http://localhost:9000 (default login `admin` / `admin`).
4. Read the public ngrok URL:

```bash
curl http://localhost:4040/api/tunnels
```

## GitHub repository secrets

| Secret | Value |
| --- | --- |
| `SONAR_TOKEN` | Token generated in SonarQube under My Account > Security |
| `SONAR_HOST_URL` | Public ngrok URL of the SonarQube server |

Push to `main` and the workflow runs tests with coverage, then uploads the analysis to SonarQube.
