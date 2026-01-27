# Exercise 5.3: Traffic Splitting (Greeter)

This exercise demonstrates traffic splitting in Istio Ambient Mesh/Gateway API. We deploy two versions of a `greeter` service and split traffic 75/25 between them.

## Components
- **Greeter v1**: Responds "Hello from Greeter v1".
- **Greeter v2**: Responds "Hi there from Greeter v2".
- **Greeter Service**: The stable frontend service (`greeter-svc`).
- **HTTPRoute**: Traffic split rule (75% -> v1, 25% -> v2).
- **Log Reader**: Updated to fetch and log the greeting.

## Instructions

### 1. Build and Push Images
```bash
# Build Greeter
docker build -t gedionkip/k8s-submissions:greeter greeter
docker push gedionkip/k8s-submissions:greeter

# Build Log Reader (Updated)
docker build -t gedionkip/k8s-submissions:log-reader log_output/log_reader
docker push gedionkip/k8s-submissions:log-reader
```

### 2. Deploy
Apply the manifests to the `exercises` namespace (ensure it has Istio Ambient enabled).

```bash
# Create namespace if needed
kubectl create ns exercises --dry-run=client -o yaml | kubectl apply -f -
kubectl label namespace exercises istio.io/dataplane-mode=ambient --overwrite

# Deploy Greeter components
kubectl apply -f greeter/manifests/deployment-v1.yaml
kubectl apply -f greeter/manifests/deployment-v2.yaml
kubectl apply -f greeter/manifests/services.yaml
kubectl apply -f greeter/manifests/traffic-split.yaml
```

### 3. Update Log Output App
You need to update your existing Log Output deployment to use the new image.
```bash
# Assuming log-output is deployed via Kustomize or similar, recreate/restart it
kubectl rollout restart deployment log-output -n exercises
```

### 4. Verify Traffic Split
You can verify the split by observing the logs or using `curl`.
Ideally, use **Kiali** to visualize the request distribution.

**Using Loop:**
```bash
# Run a temporary pod to curl the service
kubectl run curl-test --image=curlimages/curl -n exercises --rm -it --restart=Never -- /bin/sh -c 'for i in $(seq 1 20); do curl -s http://greeter-svc; echo ""; done'
```
Expected Output: Roughly 15 "Hello..." (v1) and 5 "Hi there..." (v2).
