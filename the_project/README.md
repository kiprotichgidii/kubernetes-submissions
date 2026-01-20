# The Project
Exercise 3.7: The project, step 16

## Deploy to GKE with GitHub Actions

The project is configured for automated deployment using GitHub Actions.

- **Workflow**: `.github/workflows/main.yml`
- **Trigger**: Push to any branch.
- **Process**:
    1.  Builds `todo-app` and `todo-backend` Docker images.
    2.  Pushes images to Google Artifact Registry.
    3.  Deploys to GKE.

### Branch-based Deployemnt to GKE

The deployment pipeline supports multiple environments based on the git branch:

- **Main Branch**: Deploys to the `project` namespace (Production).
- **Feature Branches**: Deploys to a namespace named after the branch (e.g., branch `feat-auth` -> namespace `feat-auth`).
    - The namespace is created automatically if it doesn't exist.
    - Kustomize is used to dynamically update the namespace in the manifests.
    - **Note**: Deployment strategy is `Recreate` to handle `ReadWriteOnce` volumes.
