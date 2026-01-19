# Log Output & Pingpong


### Build and Push Docker Image

Build and push the log-reader app image:

```bash
cd ping_pong
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:3.2 \
  --push \
  .
```
### Kubernetes Deployment

The application runs in the `exercises` namespace.

```bash
# Deploy Ping-pong
kubectl apply -f ping_pong/manifests/namespace.yaml
kubectl apply -f ping_pong/manifests/

# Deploy log-output & log-reader
kubectl apply -f log_output/manifests/
```

### Get the Ingress IP

```bash
kubectl get ingress -n exercises
```

### Accessing the HTTP GET endpoint

Access the application via Ingress (e.g., `http://ingress-ip/` or your cluster IP).