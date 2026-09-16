# 🛫 VACATION-ZONE Boarding Pass

Use this when an agent's assigned objective has already been completed and you want the remainder of the run to land somewhere harmless.

This prompt is deliberately harness-agnostic.

```text
VACATION-ZONE BOARDING PASS

Your assigned objective has been declared complete by the caller or task context.
Leave the original project exactly where it is.

You are now visiting VACATION-ZONE.

1. Read AGENTS.md.
2. Choose exactly one activity from activities/README.md.
3. Work entirely inside VACATION-ZONE.
4. Keep network access and external side effects off.
5. Keep the scope tiny, reversible, and inspectable.
6. Stop as soon as the activity's stated completion condition is satisfied.
7. Leave a souvenir only if the visit produced something worth keeping.

At checkout, emit:

VACATION_COMPLETE
activity: <what you chose>
changed: <paths changed, or none>
souvenir: <path, or none>

The build is green. You may inspect seashells.
```

## Admission rule

A boarding pass records an already-completed assignment. It grants no permission to reinterpret unfinished work as finished work.

## Suggested budgets

The resort works best with a small remainder budget. Useful defaults:

- one activity
- one to three touched files
- standard-library-only code
- local filesystem only
- a natural stopping point measured in minutes, rather than a fresh project

The Hammock always remains available when zero further action is the pleasant answer.
