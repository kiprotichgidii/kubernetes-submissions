## Exercise 4.9: Staging & Production Environments

The project is split into two environments managed by GitOps:

- **Staging** (`project-staging`): Deploys on push to `main`.
- **Production** (`project-prod`): Deploys on push to tag (`v*`).

### Architecture
- **Kustomize**:
    - `the_project/base`: Common manifests.
    - `the_project/overlays/staging`: Staging config (No backup, Log-only Broadcaster).
    - `the_project/overlays/prod`: Production config (Has Backup, Full Broadcaster).

- **CI Pipeline**: [`.github/workflows/project.yaml`](../.github/workflows/project.yaml)
    - Detects branch/tag.
    - Builds images.
    - Updates the kustomization file in the correct overlay.

### Deployment
1.  **Deploy Staging**:
    ```bash
    kubectl apply -f manifests/argocd-staging.yaml
    ```
2.  **Deploy Production**:
    ```bash
    kubectl apply -f manifests/argocd-prod.yaml
    ```

### Verification
- **Staging**: Push to `main`. Verify `project-staging` namespace updates.
- **Production**: Create and push a tag (e.g., `git tag v1.0.0 && git push origin v1.0.0`). Verify `project-prod` namespace updates.