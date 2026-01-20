# The Project
Exercise 3.8: The project, step 17

## Branch-based deletion of GKE Resources with GitHub Actions

The project is configured for automated deletion of resources using GitHub Actions.

- **Workflow**: `.github/workflows/delete.yml`
- **Trigger**: Delete a deployment branch.
- **Process**:
    1.  Deletes the namespace and all resources in it.

