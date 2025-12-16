# Log Output App

This is the Log Output app implemented as **two separate Node.js applications in two directories**, combined into a **single pod**:

- `log_generator/`: generates a random UUID on startup and writes a line with the UUID and timestamp every 5 seconds into a shared file.
- `log_reader/`: exposes an HTTP endpoint that:
    - Reads the shared file.
    - Reads a `ConfigMap` file (`information.txt`).
    - Reads a `ConfigMap` environment variable (`MESSAGE`).
    - Fetches the current ping count from the `ping-pong` service.
    - Returns all this information combined.

### Build and Push Docker Images

Build and push the log redear app image:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:2.5 \
  --push \
  .
```

### Kubernetes Deployment

The application runs in the `exercises` namespace.

```bash
# Create Namespace (if not exists)
kubectl create namespace exercises

# Apply ConfigMap
kubectl apply -f /log_output/manifests/
```

### Check the Application Logs

```bash
~❯ kubectl logs -n exercises -l app=log-output --all-containers=true     
...
Reader started on port 3000, serving file: /shared/status.log, fetching pongs from: http://ping-pong-svc:80/pings
```

### Accessing the HTTP GET endpoint

Access the application via Ingress (e.g., `http://localhost/` or your cluster IP). The output will look like:

```text
file content: this text is from file
env variable: MESSAGE=hello world
2024-03-30T12:15:17.705Z: 8523ecb1-c716-4cb6-a044-b9e83bb98e43.

Ping / Pongs: 4
```
