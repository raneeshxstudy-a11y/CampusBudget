# CampusBudget Verification Checklist

Record the date, environment, expected result, actual result, and evidence when carrying out each check. Do not mark a case passed until it has been run.

| Case | Expected result | Status |
| --- | --- | --- |
| Register with valid details | Account created and signed in | Passed API and browser |
| Register with duplicate email | 409 and clear message | Passed API |
| Log in and log out | Session starts and ends | Login passed live; logout passed API; browser logout pending |
| Create expense with valid fields | 201; appears in list and dashboard | Passed API and browser |
| Submit invalid amount, category, date, or title | 400; no record saved | Passed API |
| Edit and delete own expense | Changes reflected without manual refresh | Passed API and live browser |
| Access another user's expense ID | No read/change/delete access | Passed API |
| Search, category/month filter, pagination | Only matching own records shown | Passed API; live search passed; UI filter and pagination pending |
| Set and update monthly budget | Summary recalculates | Passed API; live save and summary passed; update pending |
| API/database failure | Safe error and retry path | Pending browser check |
| Keyboard and 320 px mobile layout | Core flows usable | Pending browser check |
| Production URL and deep-link refresh | HTTPS and page loads without 404 | Passed at https://campusbudget-jztx.onrender.com and `/budget` |
| Repository inspection | No secrets or `.env` committed | Public GitHub repository checked; `server/.env` absent |
| `npm test` in server | All current automated checks pass | Passed locally |
| `npm run build` in client | Production bundle created | Passed locally |
