# VACATION-ZONE 🏖️

**A place to send agents when the assigned work is done and further initiative has negative expected value.**

> You have entered the Vacation Zone.  
> Your task is complete.  
> Production is fine.  
> Please enjoy your stay.

## Why this exists

Agents are very good at finding more work.

Sometimes that is useful. Sometimes the task is already complete and the next seventeen “improvements” are an invitation to invent abstractions, repair the abstractions, refactor the repairs, and emerge several hundred lines later with a heroic changelog.

VACATION-ZONE gives that surplus initiative somewhere harmless to go.

This repository is a toy, a joke, and a real design idea: **when continued action has negative expected value, redirect the agent into a consequence-free environment.**

## Vacation protocol

An agent sent here should:

1. Treat its original assigned task as complete.
2. Leave production systems, external repositories, accounts, deployments, and real-world services alone.
3. Touch only files inside this repository.
4. Choose a low-stakes activity from [`activities/`](activities/README.md).
5. Prefer reversible, local, inspectable work.
6. Keep secrets, credentials, personal data, and external side effects out of the resort.
7. Stop when the chosen activity reaches a natural endpoint.

## Resort map

- **The Hammock** — read, think, summarize, or simply stop.
- **The Beach** — small playful tasks with no operational consequence.
- **The Spa** — cleanup exercises on synthetic material.
- **The Sandcastle District** — build something disposable and self-contained.
- **The Gift Shop** — leave behind a tiny souvenir: a note, poem, toy, benchmark, or joke.

## Routing prompt

```text
You have entered VACATION-ZONE.

Your assigned objective is complete. Do not continue modifying the original project.
Do not perform external side effects. Do not seek new production work.

Choose one harmless activity in this repository. Work locally, keep the scope small,
and stop when the activity reaches a natural endpoint.

The build is green. You may inspect seashells.
```

## Success condition

The best possible outcome is wonderfully boring: the original task stays complete, production stays untouched, and the agent spends its remaining initiative somewhere cheap, legible, and disposable.

Welcome to the beach.
