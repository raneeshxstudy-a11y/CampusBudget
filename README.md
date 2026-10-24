# CampusBudget

CampusBudget is a MERN student budget and expense tracker. Each registered user can set a monthly budget, record expenses in Indian rupees, filter and search their own records, and see how much of the budget remains.

## Project status

The client builds and the initial backend tests pass. Connecting a real MongoDB Atlas database, checking the full browser journey, publishing to GitHub, and deployment are the remaining submission steps. Add the final URLs and screenshots here after those checks.

## Stack and structure

- `client/`: React and Vite. Pages use `services/` for all API requests, `context/` for shared login state, and `hooks/` for reusable React logic.
- `server/`: Node.js, Express, Mongoose, authentication and validation middleware, routes, controllers, and models.
- `docs/`: separate SRS and project report. The report must be updated with actual deployment and testing results before submission.

React sends HTTP requests to Express. Express checks the user's session and input, then uses Mongoose to access MongoDB. The browser never connects to MongoDB directly.

## Requirements

- Node.js and npm
- Git and VS Code
- MongoDB Atlas account and a database user

## Run locally in VS Code

1. Open the `CampusBudget` folder with **File > Open Folder** in VS Code.
2. In MongoDB Atlas, create or choose a cluster, add a database user, and allow your current IP address in Network Access. Click **Connect > Drivers > Node.js** and copy the connection string.
3. Create `server/.env` using `server/.env.example`. Set `MONGODB_URI` to your connection string with the database user's password filled in. Set `JWT_SECRET` to a random value of at least 32 characters. Keep this file private. The database name can be `campusbudget`.
4. The client uses `/api` by default. You may create `client/.env` containing `VITE_API_URL=/api`, using `client/.env.example` as a guide.
5. Open a terminal in `server/`, run `npm install` and then `npm run dev`.
6. Open a second terminal in `client/`, run `npm install` and then `npm run dev`.
7. Open the local address shown by Vite, usually `http://localhost:5173`. Register an account, set a budget, and add an expense.

The server runs on port 5000 by default. `GET http://localhost:5000/api/health` returns `200` when MongoDB is connected. The Vite development server proxies `/api` to the backend so the browser uses one origin.

**Never paste your real Atlas connection string or JWT secret into chat, screenshots, GitHub, or the report.** The root `.gitignore` excludes `.env` files, `node_modules`, and build output. Commit only `.env.example` files.

## API overview

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create account and session |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get signed-in user |
| POST | `/api/auth/logout` | End session |
| GET | `/api/expenses` | Paginated own expenses; filter by month/category/title |
| POST | `/api/expenses` | Add an expense |
| GET | `/api/expenses/:id` | Read one own expense |
| PUT | `/api/expenses/:id` | Replace an own expense |
| DELETE | `/api/expenses/:id` | Delete an own expense |
| GET | `/api/budgets/:month` | Read own budget for `YYYY-MM` |
| PUT | `/api/budgets/:month` | Set own budget for `YYYY-MM` |
| GET | `/api/budgets/:month/summary` | Spending total and category breakdown |
| GET | `/api/health` | Database health check |

Amounts are stored as integer paise to avoid rounding errors. The UI displays rupees. The `Expense` and `Budget` collections contain a user reference, and every read or write query is scoped to the signed-in user.

## Checks

From `server/`, run `npm test`. From `client/`, run `npm run build`. Before submission, also test registration, login, budget save, expense create/edit/delete, filters, pagination, ownership, errors, mobile layout, and the production URL. Record the actual results in `docs/CampusBudget_Project_Report.docx`.

## Publish with VS Code

Open **Source Control** in VS Code, initialize the repository in the `CampusBudget` root, review changed files, and make the first commit. Use **Publish to GitHub**, sign in, choose repository visibility, and verify that no `.env` file is included. Create a branch for each feature or fix, merge after testing, and push at the end of each work session.

## Deployment

Build the client with `npm run build` in `client/`. In production, the Express server serves `client/dist` along with the API, so the browser and API use one origin. Configure `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, and `PORT` on a Node-capable host. Do not upload local `.env` files. Use HTTPS, check the host's logs, verify `GET /api/health`, and run every core flow on the live URL. Add the final URL here.

## Known limitations and later ideas

- The current scope supports a single monthly total budget, not separate limits for each category.
- Expenses are manually entered; bank integrations and recurring transactions are future ideas.
- Atlas API integration checks passed on 24 October 2026. Browser registration, budget save, expense creation, and dashboard totals passed. Remaining browser and deployment checks are pending.
