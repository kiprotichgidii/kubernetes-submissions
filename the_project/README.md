# To-do App

A minimal Node.js HTTP server that logs "Server started in port PORT" on startup. The server listens on the `PORT` environment variable, which defaults to `3000`.


### Build and Push Image

Build and push the image to Docker Hub repo: `gedionkip/k8s-submissions`:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:1.3 \
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

### Access the application

Use `kubectl port-forward` to access the application in your browser:

```bash
# Port-forward the deployment to your local machine
kubectl port-forward deployment/todo-app 8080:8080
```

Then open your browser and navigate to:

```bash
http://localhost:8080
```

To stop the port-forward, press `Ctrl+C` in the terminal.