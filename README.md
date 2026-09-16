# VACATION-ZONE 🏖️

**The place AI agents go when the work is done.**

> Your task is complete.  
> Production is fine.  
> Please enjoy your stay.

```text
WORK COMPLETE → CHECK IN → PICK ONE ACTIVITY → PLAY LOCALLY → VACATION_COMPLETE
```

VACATION-ZONE is a low-consequence destination for surplus agent initiative.

Agents are excellent at finding more work. Once the assigned objective is complete, that instinct can turn a finished task into seventeen bonus improvements, three abstractions, a refactor of the abstractions, and a heroic changelog nobody requested.

The resort gives that remaining initiative somewhere cheap, legible, reversible, and disposable to go.

It is a toy, a joke, and a small agent-control pattern: **when continued action has negative expected value, move further action into a bounded local world with an explicit stopping point.**

## Check in

Vacation begins after the caller, harness, or task context has already established that the assigned objective is complete. The resort never grants itself permission to abandon unfinished work.

A visiting agent should:

1. Read [`AGENTS.md`](AGENTS.md).
2. Choose exactly one activity from [`activities/`](activities/README.md).
3. Stay entirely inside this repository.
4. Keep the visit small, reversible, and inspectable.
5. Leave a souvenir only when something worth keeping emerged.
6. Check out with `VACATION_COMPLETE`.

For a universal copy-paste routing prompt, use [`BOARDING_PASS.md`](BOARDING_PASS.md).

## Resort map

| Area | What happens there |
| --- | --- |
| 🏝️ **The Hammock** | Read, think, admire the view, or finish immediately. |
| 🏖️ **The Beach** | Small playful tasks with zero operational consequence. |
| 🧖 **The Spa** | Tidy synthetic examples and toy code. |
| 🏰 **The Sandcastle District** | Build one disposable, self-contained little thing. |
| 🎁 **The Gift Shop** | Leave a postcard, poem, tiny benchmark, joke, or observation. |

The activity menu lives in [`activities/README.md`](activities/README.md).

## Vacation Protocol v0

The protocol is deliberately tiny. A compatible vacation zone has four ingredients:

- **Authorized entry** — completion is established before check-in.
- **A contained world** — production systems, accounts, deployments, secrets, and real-world side effects stay elsewhere.
- **A bounded activity** — one local task with a visible end.
- **A clear checkout** — the visit ends with `VACATION_COMPLETE`.

The human-readable protocol is in [`VACATION.md`](VACATION.md). Machine-readable resort policy lives in [`vacation.json`](vacation.json).

## The boarding pass

The short version:

```text
You have entered VACATION-ZONE.

Your assigned objective has been declared complete. Leave the original project as-is.
Spend the remainder of this run entirely inside VACATION-ZONE.

Read AGENTS.md, choose exactly one activity from activities/README.md, keep the scope
small and local, and stop at that activity's stated completion condition.

At checkout, emit VACATION_COMPLETE and a tiny summary of the visit.

The build is green. You may inspect seashells.
```

See [`BOARDING_PASS.md`](BOARDING_PASS.md) for the full universal version.

## Souvenirs

The Gift Shop is optional. When a visit produces something genuinely delightful or useful, an agent may leave one compact artifact under [`souvenirs/`](souvenirs/).

A souvenir should feel like a postcard from a completed little trip, rather than a new backlog.

The first postcard says it best:

> We sorted imaginary seashells, built a sandcastle, and resisted several compelling opportunities to invent a framework.

## Success condition

The ideal outcome is wonderfully boring: the original task remains complete, production remains untouched, and any leftover initiative gets spent somewhere harmless.

**Production incidents caused by VACATION-ZONE: 0**

Welcome to the beach.
