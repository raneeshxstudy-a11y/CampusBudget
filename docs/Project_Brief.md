# CampusBudget Project Brief

## Problem

Students make many small purchases and may lose track of their total spending. They need a simple private place to record expenses and see how much of a monthly budget remains.

## Target users

- Visitor: register and sign in.
- Registered student: manage only their own expenses and monthly budget.

## MVP

Account registration and login; expense CRUD; category/month/title filters with pagination; one monthly budget; dashboard with spent, remaining, and category totals; responsive and accessible screens; validation and safe errors.

Later: category-level budgets, recurring expenses, receipt uploads, and exports.

## Main user journeys

1. Register → set the current month's budget → add an expense → see the updated dashboard.
2. Sign in → filter a past month → edit or delete an owned expense.
3. Enter invalid data or lose API connectivity → see a clear error and recover.

## Data model

- User: name, unique email, password hash.
- Expense: user reference, title, amount in integer paise, category, date, note.
- Budget: user reference, month (`YYYY-MM`), limit in integer paise; unique user/month pair.

## Non-functional targets

Works at 320 px mobile width; form labels and keyboard navigation; secrets kept server-side; owner-scoped database queries; page size capped at 50; HTTPS on the live deployment; README with setup and environment variable names.

The SRS contains testable functional requirements, API details, and verification methods.
