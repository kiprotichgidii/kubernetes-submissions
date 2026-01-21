## Exercise 3.11: The project, step 19

### Resource Limits

Resource requests and limits have been defined for all containers to ensure stability and fair scheduling.

| Container | CPU Request | Memory Request | CPU Limit | Memory Limit |
| :--- | :--- | :--- | :--- | :--- |
| `todo-app` (Frontend) | `100m` | `128Mi` | `200m` | `256Mi` |
| `todo-backend` (API) | `100m` | `128Mi` | `200m` | `256Mi` |
| `postgres` (Database) | `200m` | `256Mi` | `1000m` | `512Mi` |

