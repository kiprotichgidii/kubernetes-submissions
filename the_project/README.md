# The Project
Exercise 3.6: The project, step 15

## Deploy to GKE with GitHub Actions

The project is configured for automated deployment using GitHub Actions.

- **Workflow**: `.github/workflows/main.yml`
- **Trigger**: Manual via GitHub "Actions" tab (Workflow Dispatch) or on push to main (if configured).
- **Process**:
    1.  Builds `todo-app` and `todo-backend` Docker images.
    2.  Pushes images to Google Artifact Registry.
    3.  Deploys to GKE using Kustomize (replacing image tags).
    4.  Waits for rollout (Deployment strategy is set to `Recreate` to handle `ReadWriteOnce` volumes).
