# To-do App

A minimal Node.js HTTP server that logs "Server started in port PORT" on startup. The server listens on the `PORT` environment variable, which defaults to `3000`.


### Build and Push Image

Build and push the image to Docker Hub repo: `gedionkip/k8s-submissions`:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:1.2 \
  --push \
  .
```

### Kubernetes deployment

```bash
# Apply the manifest
kubectl apply -f manifests/deployment.yaml
# OR
kubectl apply -f manifests/
```
### View the logs

View the output of the deployed web server:

```bash
kubectl logs -l app=todo-app
#OR
kubectl logs -f deployment/todo-app
```