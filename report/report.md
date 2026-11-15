# Assignment 16 - Integrate SonarQube with GitHub Actions for Code Quality Analysis

## 1. Objective

Set up SonarQube with a sample project and configure GitHub Actions to analyze code quality on every push, then verify the generated report in the SonarQube dashboard.

## 2. Technology Stack

| Component | Choice |
| --- | --- |
| Sample project | JavaScript (Node.js 20) |
| Test framework | Jest 29 with lcov coverage |
| Code analysis | SonarQube 26.11 Community Build (Docker) |
| Database | PostgreSQL 17 (Docker) |
| Public tunnel | ngrok (Docker image) |
| CI/CD | GitHub Actions |

## 3. Architecture

```
Developer push
      |
      v
GitHub Actions (ubuntu-latest)
      |  checkout, Node 20, npm ci, jest --coverage
      v
SonarQube Scanner action
      |  SONAR_TOKEN + SONAR_HOST_URL
      v
ngrok public URL  --->  SonarQube container :9000  --->  PostgreSQL
```

The local SonarQube server is exposed through ngrok because GitHub-hosted runners cannot reach `localhost`. The workflow reads the public URL from the `SONAR_HOST_URL` secret.

## 4. Project Structure

```
code/
├── .github/workflows/sonarqube.yml
├── docker-compose.yml
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── sonar-project.properties
├── src/
│   ├── calculator.js
│   ├── index.js
│   └── legacy-utils.js
└── test/
    ├── calculator.test.js
    ├── index.test.js
    └── legacy-utils.test.js
```

## 5. Implementation

### 5.1 Sample project

`src/calculator.js` exposes `add`, `subtract`, `multiply`, `divide`, `power`, `percentage` and `average`. Input validation throws `TypeError` for non-numeric values and `RangeError` for division by zero. `src/index.js` runs a small demo and is exported for testing.

### 5.2 Tests

31 Jest tests cover arithmetic operations, error paths, the demo runner and the legacy utilities.

```
Test Suites: 3 passed, 3 total
Tests:       31 passed, 31 total
Coverage:    98.43% statements, 96.15% branches, 100% functions
```

### 5.3 SonarQube configuration

`sonar-project.properties`:

```properties
sonar.projectKey=assignment16-sonarqube-calculator
sonar.projectName=Assignment 16 - SonarQube GitHub Actions
sonar.projectVersion=1.0.0
sonar.sources=src
sonar.tests=test
sonar.sourceEncoding=UTF-8
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.exclusions=node_modules/**,coverage/**,.scannerwork/**
sonar.host.url=http://localhost:9000
sonar.login=${env.SONAR_TOKEN}
```

The token is injected from the environment, so no credential is stored in the repository. During CI, `SONAR_HOST_URL` overrides the local host URL.

### 5.4 SonarQube server and tunnel

`docker-compose.yml` starts PostgreSQL 17, SonarQube 26.11 Community and the ngrok agent.

```bash
cd code
cp .env.example .env
# edit .env: NGROK_AUTHTOKEN, SONAR_TOKEN, SONAR_HOST_URL
docker compose up -d
```

- SonarQube dashboard: http://localhost:9000 (first login `admin` / `admin`, password change is enforced)
- ngrok inspector: http://localhost:4040
- Public URL: `curl http://localhost:4040/api/tunnels`

To keep a stable URL, claim the free static domain in ngrok and change the service command to `http --domain=<your-domain> sonarqube:9000`. The current tunnel uses a static free domain, so `SONAR_HOST_URL` stays valid across restarts.

### 5.5 GitHub Actions workflow

`.github/workflows/sonarqube.yml` runs on every push to `main`, on pull requests and manually:

1. Checkout the repository with full history (`fetch-depth: 0`) for accurate blame data.
2. Set up Node.js 20 with npm caching.
3. Install dependencies using `npm ci`.
4. Run unit tests and generate `coverage/lcov.info`.
5. Run `SonarSource/sonarqube-scan-action@v5` with `SONAR_TOKEN` and `SONAR_HOST_URL`.

Required repository secrets:

| Secret | Description |
| --- | --- |
| `SONAR_TOKEN` | Token generated in SonarQube (My Account > Security) |
| `SONAR_HOST_URL` | Public ngrok URL, e.g. `https://xxxx.ngrok-free.app` |

## 6. Execution Steps

1. Create the GitHub repository and push the `code/` folder.
2. Start the Docker stack and open http://localhost:9000.
3. Create the project `assignment16-sonarqube-calculator` and generate a token.
4. Add `SONAR_TOKEN` and `SONAR_HOST_URL` in GitHub repository settings.
5. Push a commit to `main`.
6. Confirm the "SonarQube Analysis" workflow succeeds in the Actions tab.
7. Open the project in SonarQube and review the analysis report.

## 7. Results

Fill this table after the workflow completes.

| Metric | Value |
| --- | --- |
| Quality Gate | Failed (ERROR) - 7 new violations |
| Bugs | 3 |
| Vulnerabilities | 0 |
| Security Hotspots | 0 |
| Code Smells | 4 |
| Coverage | 97.8% (lines 98.4%, branches 96.2%) |
| Duplications | 0.0% |
| Maintainability Rating | A (1.0) |
| Reliability Rating | C (3.0) |
| Security Rating | A (1.0) |
| Lines of Code (ncloc) | 140 |
| Cyclomatic Complexity | 35 |
| Cognitive Complexity | 11 |

`src/legacy-utils.js` was added on purpose to demonstrate how SonarQube flags defects and quality-gate failures.

| Severity | Type | Rule | Finding |
| --- | --- | --- | --- |
| MAJOR | BUG | javascript:S1764 | Identical sub-expressions on both sides of `\|\|` |
| MAJOR | BUG | javascript:S3923 | All conditional branches return the same value |
| MAJOR | BUG | javascript:S2688 | `NaN` used in a comparison instead of `isNaN` |
| BLOCKER | CODE_SMELL | javascript:S3516 | Function always returns the same value (x2) |
| MINOR | CODE_SMELL | javascript:S7773 | Prefer `Number.parseInt` / `Number.NaN` (x2) |

Analysis performed locally with `sonarsource/sonar-scanner-cli` against the Docker SonarQube server; the same scan runs in CI on every push.

Dashboard screenshot: `report/sonarqube-dashboard.png`

![SonarQube dashboard](sonarqube-dashboard.png)

Issues screenshot: `report/sonarqube-issues.png`

![SonarQube issues](sonarqube-issues.png)

## 8. Troubleshooting

| Problem | Cause | Fix |
| --- | --- | --- |
| `Could not connect to SonarQube server` | ngrok URL changed or tunnel down | Restart the `ngrok` service, read the new URL, update `SONAR_HOST_URL`, re-run the workflow |
| `Not authorized` in scan step | Token missing, expired or wrong project | Regenerate the token in SonarQube and update `SONAR_TOKEN` |
| `Project not found` | Project key mismatch or token lacks create permission | Compare `sonar.projectKey` with the dashboard |
| SonarQube container restarts | Postgres not ready | Wait for the `db` healthcheck; check `docker compose logs sonarqube` |
| Coverage 0% in SonarQube | `coverage/lcov.info` missing in CI | Ensure `npm run test:ci` runs before the scan step |

## 9. Submission

- GitHub repository: `<add link after pushing>`
- SonarQube report screenshot: `report/sonarqube-dashboard.png`
- Public dashboard (while the tunnel is running): https://tuition-cilantro-unexpired.ngrok-free.dev
- Tracking notes: `docs/agent.md`
