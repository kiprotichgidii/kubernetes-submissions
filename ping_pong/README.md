## Exercise 4.1: Readiness probe

Build and push the new docker images:

```bash
# PING-PONG (v4.1.0)
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:4.1.0 \
  --push \
  ping_pong

# LOG-GENERATOR (v4.1.1 - unchanged, just updating tags)
cd ../log_output/log_generator
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:4.1.1 \
  --push \
  .

# LOG-READER (v4.1.2)
cd ../log_reader
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:4.1.2 \
  --push \
  .
```

## Readiness Probes

Readiness probes have been added to ensure applications are only traffic-ready when dependencies are available.

*   **Ping-pong**: Checks database connectivity via `/healthz`.
    *   It will be `0/1` if the database is not reachable.
*   **Log-output**: Checks connectivity to Ping-pong via `/healthz`.
    *   It will be `1/2` (Reader failing) if Ping-pong is unreachable.

Using the kustomization manifest in the root directory:

1.  Apply deployments without the database:
    ```bash
    kubectl apply -k .
    ## Output
    namespace/exercises created
    configmap/log-output-config created
    service/log-output-svc created
    service/ping-pong-svc created
    deployment.apps/log-output created
    deployment.apps/ping-pong created
    gateway.gateway.networking.k8s.io/log-gateway created
    httproute.gateway.networking.k8s.io/log-route created
    ```
2.  Observe pods are not ready:
    ```bash
    kubectl get pods -n exercises
    ## Output
    NAME                          READY   STATUS    RESTARTS   AGE
    log-output-77f66696bd-945pp   1/2     Running   0          18m
    ping-pong-78f4f74b88-8gc7x    0/1     Running   0          18m
    ```
3.  Include the postgres manifest in and apply with kustomize:
    ```bash
    kubectl apply -k .
    ## Output
    namespace/exercises unchanged
    configmap/log-output-config unchanged
    service/log-output-svc unchanged
    service/ping-pong-svc unchanged
    Warning: spec.SessionAffinity is ignored for headless services
    service/postgres-svc created
    deployment.apps/log-output unchanged
    deployment.apps/ping-pong unchanged 
    statefulset.apps/postgres-db created
    gateway.gateway.networking.k8s.io/log-gateway configured
    httproute.gateway.networking.k8s.io/log-route configured
    ```
4.  Observe pods become ready:
    ```bash
    kubectl get pods -n exercises
    # Output
    NAME                          READY   STATUS    RESTARTS   AGE
    log-output-77f66696bd-945pp   2/2     Running   0          30m
    ping-pong-78f4f74b88-8gc7x    1/1     Running   0          30m
    postgres-db-0                 1/1     Running   0          8m11s
    ```