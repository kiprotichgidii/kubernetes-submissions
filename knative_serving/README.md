## Exercise 5.7: Serverless Ping-Pong

Serverless `ping-pong` application.

### Create Namespace and Deploy Database 
Ensure the Postgres database is running in the `exercises` namespace:
```bash
kubectl apply -f ping_pong/manifests/namespace.yaml
kubectl apply -f ping_pong/manifests/postgres.yaml
```

### Deploy Knative Ping-Pong
Apply the Knative Service manifest:
```bash
kubectl apply -f knative_serving/manifests/knative-pingpong.yaml
```

We can check the service status and URL obtain URL:
```bash
❯ k get ksvc -n exercises
NAME        URL                                                 LATESTCREATED     LATESTREADY       READY   REASON
ping-pong   http://ping-pong.exercises.192.168.1.221.sslip.io   ping-pong-00001   ping-pong-00001   True
```

To scale to zero, we can access the Knative Service URL and see as pods get span up:

```bash
❯ curl http://ping-pong.exercises.192.168.1.221.sslip.io
```
When we wait for ~60-90 seconds, the pods are terminated or are in terminating state:

```bash
❯ k get pods -n exercises
postgres-db-0                                 1/1     Running       0          7m4s
ping-pong-00001-deployment-598655494f-4z9kb   2/2     Terminating   0          62s
ping-pong-00001-deployment-598655494f-4z9kb   2/2     Terminating   0          62s
ping-pong-00001-deployment-598655494f-4z9kb   1/2     Terminating   0          91s
ping-pong-00001-deployment-598655494f-flmc5   1/2     Terminating   0          6m44s
ping-pong-00001-deployment-598655494f-flmc5   0/2     Completed     0          6m44s
ping-pong-00001-deployment-598655494f-flmc5   0/2     Completed     0          6m45s
ping-pong-00001-deployment-598655494f-flmc5   0/2     Completed     0          6m45s
```
