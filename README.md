# Assignment 16 - SonarQube with GitHub Actions

Sample JavaScript (Node.js) project analyzed by SonarQube 26.11 on every push through GitHub Actions.

- Repository: https://github.com/S999Y/SonarQube-with-GitHub
- Full write-up: [report/report.md](report/report.md)
- SonarQube dashboard (while the tunnel is up): https://tuition-cilantro-unexpired.ngrok-free.dev

## Stack

| Component | Version |
| --- | --- |
| Runtime | Node.js 20+ |
| Tests | Jest 29 with lcov coverage |
| Code analysis | SonarQube 26.11 Community Build (Docker) |
| Database | PostgreSQL 17 (Docker) |
| Public tunnel | ngrok (native Windows agent or Docker image) |
| CI/CD | GitHub Actions |

## Repository layout

```
.
├── .github/workflows/sonarqube.yml
├── docker-compose.yml
├── sonar-project.properties
├── src/
│   ├── calculator.js
│   ├── index.js
│   └── legacy-utils.js        # intentional defects for the demo
├── test/
│   ├── calculator.test.js
│   ├── index.test.js
│   └── legacy-utils.test.js
└── report/
    ├── report.md
    └── images/
```

## Local usage

```bash
npm ci
npm test
npm start
```

`npm test` writes coverage to `coverage/lcov.info`, which the Sonar scan consumes.

## Start SonarQube

Create `.env` from `.env.example` and fill in the values:

```
NGROK_AUTHTOKEN=<your ngrok authtoken>
SONAR_HOST_URL=http://localhost:9000
SONAR_TOKEN=<token from SonarQube>
```

Start the database and server:

```bash
docker compose up -d db sonarqube
```

- Dashboard: http://localhost:9000
- First login: `admin` / `admin` (a password change is enforced)
- Start the bundled ngrok container with `docker compose up -d ngrok`, or run it natively:
  ```bash
  ngrok http 9000 --url https://tuition-cilantro-unexpired.ngrok-free.dev
  ```

The `.env` file is git-ignored; never commit the token or authtoken.

## Create the project and token manually

1. SonarQube → **Projects → Create Project → Manually**.
2. Project key: `assignment16-sonarqube-calculator` (must match `sonar-project.properties`).
3. Avatar → **My Account → Security → Generate Tokens** → copy the token into `.env` as `SONAR_TOKEN`.

## Run a scan manually

```bash
npm ci
npm run test:ci

TOKEN=$(grep '^SONAR_TOKEN=' .env | cut -d= -f2)
docker run --rm --network code_default -v "$PWD:/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dsonar.host.url=http://sonarqube:9000 -Dsonar.login=$TOKEN
```

Open http://localhost:9000/dashboard?id=assignment16-sonarqube-calculator.

## GitHub Actions

The workflow runs on every push to `main`, on pull requests and manually:

1. Checkout (full history).
2. Set up Node.js 20 with npm caching.
3. `npm ci`.
4. `npm run test:ci` (Jest + lcov).
5. `SonarSource/sonarqube-scan-action@v5` with the two secrets.

Required **repository secrets** (Settings → Secrets and variables → Actions → **Secrets** tab):

| Secret | Value |
| --- | --- |
| `SONAR_TOKEN` | Token generated in SonarQube |
| `SONAR_HOST_URL` | `https://tuition-cilantro-unexpired.ngrok-free.dev` |

`SONAR_HOST_URL` must include `https://` and have no trailing slash. Keep ngrok running while the job executes.

## Expected result

`src/legacy-utils.js` contains deliberate defects so the analysis produces findings:

| Metric | Value |
| --- | --- |
| Quality Gate | Failed (ERROR) - 7 new violations |
| Bugs | 3 |
| Code Smells | 4 |
| Coverage | 97.8% |
| Duplications | 0.0% |
| Reliability | C |

31 Jest tests pass; the gate fails because of the seeded defects, which is the intended demonstration.

Screenshots: [report/images](report/images) and metrics in [report/report.md](report/report.md).

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `Expected URL scheme 'http' or 'https' but no scheme was found` | `SONAR_HOST_URL` is missing/empty. Add it under **repository secrets** (not variables) and re-run the job |
| `Not authorized` | Regenerate the token in SonarQube and update `SONAR_TOKEN` |
| `Could not connect to SonarQube server` | ngrok tunnel is down or the URL changed; restart ngrok and update `SONAR_HOST_URL` |
| Coverage 0% | `coverage/lcov.info` is missing; make sure `npm run test:ci` runs before the scan |
| SonarQube container restarts | Postgres is still starting; wait for the `db` healthcheck and check `docker compose logs sonarqube` |
