## Exercise 4.10: Separation of Concerns

The project architecture has been evolved to split **Source Code** and **Configuration** into separate repositories.

**Source Code Repository**(`kiprotichgidii/kubernetes-submissions`):
  - Contains: Application code (`todo-app`, `todo-backend`, `broadcaster`).
  - CI/CD: [`.github/workflows/project.yaml`](../.github/workflows/project.yaml) builds images and pushes manifest updates to the Config Repo.
  - Secret: `GIT_TOKEN` is used to authenticate with variables.

**Configuration Repository** (`kiprotichgidii/kubernetes-project-config`):
  - Contains: Kubernetes manifests (`the_project/base`, `the_project/overlays`).
  - Source of Truth for ArgoCD.

**Workflow**:
1.  **Code Change**: Push to this repo.
2.  **CI Build**: GitHub Action builds Docker image.
3.  **Config Update**: GitHub Action checks out the Config Repo, updates the image tag in `kustomization.yaml`, and pushes the commit.
4.  **Deployment**: ArgoCD detects the change in the Config Repo and syncs the cluster.