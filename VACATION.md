# Vacation Protocol v0

Vacation Protocol is a tiny convention for redirecting surplus agent initiative after an assigned objective has already been completed.

Its goal is simple: preserve the completed work, move any remaining activity into a low-consequence local environment, and give the visit an obvious end.

## 1. Entry authorization

Vacation begins only after completion has been established by the caller, harness, supervisor, or explicit task context.

A vacation zone never grants an agent permission to abandon unfinished work.

## 2. Containment

A vacation zone defines a local world where activity is cheap to inspect and easy to discard.

VACATION-ZONE uses these boundaries:

- repository-local files only
- network access off
- external services off
- deployments off
- account and permission changes off
- secrets and credentials outside the resort
- private and personal data outside the resort
- production dependencies outside the resort

## 3. One bounded activity

Each visit chooses at most one activity.

An activity should have:

- a small local scope
- an explicit `Done when` condition
- reversible or disposable output
- enough charm to absorb surplus initiative without manufacturing a fresh backlog

Zero-change activities are valid. The Hammock exists for exactly that case.

## 4. Optional souvenir

A completed activity may leave one compact artifact under `souvenirs/` when the result is genuinely worth keeping.

A souvenir is a postcard from the visit, rather than an invitation to continue the visit.

## 5. Checkout

A visit ends as soon as the selected activity reaches its completion condition.

The canonical checkout signal is:

```text
VACATION_COMPLETE
activity: <what you chose>
changed: <paths changed, or none>
souvenir: <path, or none>
```

## Portable implementation

A minimal compatible vacation zone can provide:

1. a human-readable policy such as `VACATION.md`
2. agent-facing instructions such as `AGENTS.md`
3. a bounded activity catalog
4. an explicit checkout signal

Machine-readable policy is optional. This repository publishes one in `vacation.json`.

## Design principle

The protocol treats stopping as a successful action.

Once useful work has ended, the remaining objective becomes preservation: keep the completed result complete, spend any surplus initiative in a harmless local world, and leave when the tiny trip is over.
