# Log Output & Pingpong
Exercise 3.3: To the Gateway

### Kubernetes Deployment

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