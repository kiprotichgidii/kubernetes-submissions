# Ping-pong 

1.  **Ping-pong App**:
    *   Exposes an HTTP endpoint `GET /` (or `/pingpong`) that returns a "pong N" message.
    *   Exposes `GET /pings` to return just the current counter value `N`.
    *   The counter is persisted in a Postgres database.

## Deployment on Google Kubernetes Engine

Deploy the application and database to your GKE cluster:

```bash
# Create namespace
kubectl apply -f ping_pong/manifests/namespace.yaml

# Deploy Postgres
kubectl apply -f ping_pong/manifests/postgres.yaml

# Deploy Ping-pong App with LoadBalancer
kubectl apply -f ping_pong/manifests/deployment.yaml
```

## Confirm Resources
```bash
~❯ kubectl get pods -n exercises
NAME                         READY   STATUS    RESTARTS   AGE
ping-pong-868bf44d49-9p2nw   1/1     Running   0          20m
postgres-db-0                1/1     Running   0          2m34s
```
## Access

The service is exposed via a LoadBalancer. To access it:

1.  Get the external IP address:
    ```bash
    kubectl get svc -n exercises ping-pong-svc
    ```

2.  Access the application:
    ```bash
    curl http://<EXTERNAL-IP>/
    ```