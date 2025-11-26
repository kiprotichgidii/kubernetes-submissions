# Log Output App

An application that generates a random UUID on startup, stores it in memory, and outputs it every 5 seconds with a timestamp.

### Build and Push Docker Image

Build the docker container and push to Docker Hub repository; `gedionkip/k8s-submissions`:

```bash
docker buildx build \
--platform linux/amd64,linux/arm64 \
-t gedionkip/k8s-submissions:1.7 \
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