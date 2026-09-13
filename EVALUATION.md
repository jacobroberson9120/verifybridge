# VerifyBridge diagnostic evaluation

36 AI-authored synthetic cases, excluded from training. Related multilingual scenarios are not independent observations. Labels reflect the fictional author intent (including scams whose wording is ambiguous). This is a development diagnostic, not independently labeled evidence or a real-world accuracy benchmark. No model retraining or rule tuning used these cases in this iteration.

A flag means either “Pause and verify” or “Strong warning signs.” A miss means “No clear warning signs,” which never means safe.

| Language | Scam cases flagged | Scams missed | Benign cases flagged | Benign cases unflagged |
|---|---:|---:|---:|---:|
| en | 4 | 0 | 0 | 5 |
| es | 4 | 0 | 0 | 5 |
| vi | 4 | 0 | 0 | 5 |
| zh | 4 | 0 | 0 | 5 |
| all | 16 | 0 | 0 | 20 |

## Cases needing review


## Next evaluation step

Obtain consented or public examples, have independent reviewers label them, keep related templates in one split, and reserve a new untouched test set before tuning. Native-speaker review is pending. Do not use this small challenge set to advertise accuracy.
