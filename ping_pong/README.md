# Ping-pong and Log output

This project demonstrates two microservices, `Ping-pong` and `Log output`, communicating via HTTP.

1.  **Ping-pong App**:
    *   Exposes an HTTP endpoint `GET /` (or `/pingpong`) that returns a "pong N" message.
    *   Exposes `GET /pings` to return just the current counter value `N`.
    *   Exposes `GET /pings` to return just the current counter value `N`.
    *   The counter is persisted in a Postgres database.

2.  **Log-output App**:
    *   Consists of a `log-generator` that writes timestamps to an internal ephemeral volume.
    *   Consists of a `log-reader` that:
        *   Reads the latest timestamp from the internal volume.
        *   Fetches the current ping count from the `Ping-pong` app via `http://ping-pong-svc:80/pings`.
        *   Aggregates and displays the status.

## Build and Push Images

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:2.7 \
  --push \
  .
```

## Kubernetes Deployment

Deploy the applications and services:

```bash
# Deploy Ping-pong
kubectl apply -f ping_pong/manifests/

# Deploy Log-output
kubectl apply -f log_output/manifests/
```

## Confirm Resouces
```bash
~❯ kubectl get pods -n exercises
NAME                          READY   STATUS    RESTARTS   AGE
log-output-65978bb5c9-9mtz6   2/2     Running   0          14m
ping-pong-7c99d68c8f-pkjm5    1/1     Running   0          15m
```
## Access

Access the Log Output application through the Ingress:

```bash
curl http://ingress-ip/
```
![](./images/exercise-2-1.png)
