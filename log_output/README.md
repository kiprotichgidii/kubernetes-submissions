# Log Output App

This app is implemented as **two separate Node.js applications in two directories**, combined into a **single pod**:

- `generator/`: generates a random UUID on startup and writes a line with the UUID and timestamp every 5 seconds into a shared file.
- `reader/`: exposes an HTTP endpoint that reads that shared file and returns the contents.

### Build and Push Docker Images

Build and push the two containers:

```bash
# Generator image
cd generator
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/log-output-generator:1.0 \
  --push \
  .

# Reader image
cd ../reader
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/log-output-reader:1.0 \
  --push \
  .
```

### Kubernetes Deployment

Deploy the app in Kubernetes using the `yaml` manifest:

```bash
kubectl apply -f manifests/
```

### Check the deployment,service and ingress

```bash
~ ❯ kubectl get deploy                                 
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
log-output   1/1     1            1           6m2s

~ ❯ kubectl get svc                                                          
NAME             TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
kubernetes       ClusterIP   10.233.0.1     <none>        443/TCP   34d
log-output-svc   ClusterIP   10.233.22.44   <none>        80/TCP    6m7s

~ ❯ kubectl get ing                                                          
NAME         CLASS   HOSTS   ADDRESS         PORTS   AGE
log-output   nginx   *       192.168.1.205   80      6m12s
```