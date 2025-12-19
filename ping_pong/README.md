# Ping-pong 

1.  **Ping-pong App**:
    *   Exposes an HTTP endpoint `GET /` (or `/pingpong`) that returns a "pong N" message.
    *   Exposes `GET /pings` to return just the current counter value `N`.
    *   Exposes `GET /pings` to return just the current counter value `N`.
    *   The counter is persisted in a Postgres database.


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
```

## Confirm Resources
```bash
~❯ kubectl get pods -n exercises
NAME                         READY   STATUS    RESTARTS   AGE
ping-pong-6f98f7d4fb-847k7   1/1     Running   0          5m
postgres-db-0                1/1     Running   0          5m
```
## Access

Access the Log Output application through the Ingress:

```bash
curl http://ingress-ip/pingpong
```
Every time the pod is deleted and restarted, the counter persists and picks up from where it left off.
