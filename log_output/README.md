# Log Output & Pingpong
Exercise 3.4: Rewritten Routing

### Build and Push Docker Image
Build and Push the pingpong app image:

```bash
cd ping_pong
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:3.4 \
  --push \
  .
```

### Kubernetes Deployment (GKE)

The application runs in the `exercises` namespace.

```bash
# Create the exercises namespace
kubectl apply -f ping_pong/manifests/namespace.yaml

# Deploy log-output & log-reader with Gateway
kubectl apply -f log_output/manifests/

# Deploy the Pingpong app
kubectl apply -f ping_pong/manifests/
```

### Get the Gateway IP

```bash
kubectl get gateway -n exercises
```

### Accessing the Endpoint

Access the application via the Gateway IP (e.g., `http://<GATEWAY-IP>/` or `http://<GATEWAY-IP>/pingpong`).