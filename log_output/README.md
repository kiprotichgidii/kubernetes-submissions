# Log Output App

This app is implemented as **two separate Node.js applications in two directories**, combined into a **single pod**:

- `generator/`: generates a random UUID on startup and writes a line with the UUID and timestamp every 5 seconds into a shared file.
- `reader/`: exposes an HTTP endpoint that reads that shared file and returns the contents.

### Build and Push Docker Images

Build and push the two containers:

```bash
# Generator image
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:1.10.1 \
  --push \
  .

# Reader image
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:1.10.2 \
  --push \
  .
```

### Kubernetes Deployment

Deploy the app in Kubernetes using the `yaml` manifest:

```bash
kubectl apply -f manifests/
```

### Check the Application Logs

```bash
kubectl logs [-f] [-p] (POD | TYPE/NAME) [-c CONTAINER]
```