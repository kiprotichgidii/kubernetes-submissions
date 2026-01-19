# Log Output & Pingpong
Exercise 3.3: To the Gateway

### Kubernetes Deployment

The application runs in the `exercises` namespace.

```bash
# Deploy Ping-pong
kubectl apply -f ping_pong/manifests/namespace.yaml
kubectl apply -f ping_pong/manifests/

# Deploy log-output & log-reader with Gateway
kubectl apply -f log_output/manifests/
```

### Get the Gateway IP

```bash
kubectl get gateway -n exercises
```

### Accessing the Endpoint

Access the application via the Gateway IP (e.g., `http://<GATEWAY-IP>/` or `http://<GATEWAY-IP>/pingpong`).