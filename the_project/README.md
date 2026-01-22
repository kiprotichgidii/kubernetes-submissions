## Exercise 3.12: The project, step 21

### Readiness Probes

I added health checks to the `todo-backend`:
- **Readiness Probe**: Defined in `deployment.yaml`.
    - Endpoint: `/healthz` (returns 200 OK if DB connection is active).
    - Failure threshold: Pods restart or are removed from service endpoints if the database is unreachable.

### Testing

For testing, I deployed the app with a bad password for the database in `deployment.yaml` and verified that the backend pod was not ready and not receiving traffic. I then corrected the password and verified that the backend pod was ready and receiving traffic.
