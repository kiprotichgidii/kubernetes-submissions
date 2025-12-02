# Ping-Pong App
An application that simply responds with "pong 0" to a GET request and increases a counter (the '0') so that you can see how many requests have been sent.

### Build and Push Image
Build and push the image to Docker Hub:
```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:1.9 \
  --push \
  .
```

### Deploy Log Output and Ping-pong app

```bash
kubectl apply -f log_output/manifests/
kubectl apply -f pingpong/manifests/
```

### Access the Ping-Pong app
The Ping-Pong app is accessible via the Log Output app ingress. It can be accessed at `http://ingress-controller-ip/pingpong`