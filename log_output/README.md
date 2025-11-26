# Log Output App

An application that generates a random UUID on startup, stores it in memory, and outputs it every 5 seconds with a timestamp.

### Build and Push Docker Image

Build the docker container and push to Docker Hub repository; `gedionkip/k8s-submissions`:

```bash
docker buildx build \
--platform linux/amd64,linux/arm64 \
-t gedionkip/k8s-submissions:1.7 \
--push \
.
```

### Kubernetes Deployment

Deploy the app in Kubernetes using the `yaml` manifest:

```bash
kubectl apply -f manifests/
```