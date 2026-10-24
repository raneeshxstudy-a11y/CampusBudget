# CampusBudget Screen Wireframes

These are rough navigation and layout sketches for the MVP. The final responsive UI may adjust spacing and arrangement while preserving the same flows.

## Navigation

```text
Register ──> Overview <──> Expenses <──> Monthly budget
   ^            |
   |            v
 Login <───── Sign out
```

## Desktop overview

```text
┌─────────────┬───────────────────────────────────────────────┐
│ Brand       │ Greeting                         Month picker │
│ Overview    ├──────────────────────┬────────────────────────┤
│ Expenses    │ Monthly budget       │ Total spent            │
│ Budget      ├──────────────────────┼────────────────────────┤
│ Account     │ Recent expenses      │ Category breakdown     │
└─────────────┴──────────────────────┴────────────────────────┘
```

## Mobile overview

```text
┌─────────────────────────┐
│ Brand and navigation    │
├─────────────────────────┤
│ Greeting, month picker  │
│ Monthly budget          │
│ Total spent             │
│ Recent expenses         │
│ Category breakdown      │
└─────────────────────────┘
```

## Expenses screen

```text
Header + Add expense button
Optional expense form: title, amount, category, date, note
Filters: month, category, title search
List: title, category, date, amount, edit, delete
Previous / next pagination
```

Every data area also needs loading, empty, and error presentations. Forms show validation messages next to the action area.
