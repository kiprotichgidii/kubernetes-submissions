## Exercise 5.6. Trying serverless

### Install Knative Serving Components
Install the required custom resources by running the command:

```bash
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.20.1/serving-crds.yaml
```
Install the core components of Knative Serving by running the command:

```bash
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.20.1/serving-core.yaml
```
### Install a networking layer

#### Kourier

Install the Knative Kourier controller:

```bash
kubectl apply -f https://github.com/knative-extensions/net-kourier/releases/download/knative-v1.20.0/kourier.yaml
```
Configure Knative Serving to use Kourier by default:

```bash
kubectl patch configmap/config-network \
--namespace knative-serving \
--type merge \
--patch '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'
```
Get the external IP address (FQDN) to later configure DNS:

```bash
❯ kubectl --namespace kourier-system get service kourier
NAME      TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE
kourier   LoadBalancer   10.233.17.59   192.168.1.221   80:30525/TCP,443:30731/TCP   2m35s
```
Confirm successfull installation:

```bash
❯ k get pods -n knative-serving
NAME                                     READY   STATUS    RESTARTS        AGE
activator-947b78556-vznbz                1/1     Running   0               60m
autoscaler-666bc4996f-8tcjf              1/1     Running   0              60m
controller-99d4d7fdf-97sdq               1/1     Running   0               60m
net-kourier-controller-7b7dd6479-4xxpn   1/1     Running   0               16m
webhook-68c8746754-6vtz5                 1/1     Running   0               16m
```

### Configure Magic DNS

Knative provides a Kubernetes Job called default-domain that configures Knative Serving to use sslip.io as the default DNS suffix.

```bash
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.20.2/serving-default-domain.yaml
```

### Deploying a Knative Service

A "Hello world" Knative Service that accepts the environment variable TARGET and prints Hello ${TARGET}!.

Deploying:
```bash
kubectl apply -f manifests/hello-world.yaml
```
### Autoscaling

Knative Serving provides automatic scaling, also known as autoscaling. This means that a Knative Service by default scales down to zero running pods when it is not in use.

View a list of Knative Services by running the command:

```bash
kubectl get ksvc
```
We can access the Knative Service by running the command:

```bash
for i in $(seq 1 4); do curl  http://hello.default.192.168.1.221.sslip.io; done
```

Watch the pods and see how they scale to zero after traffic stops going to the URL:

```bash
❯ kubectl get pod -l serving.knative.dev/service=hello --watch
NAME                                    READY   STATUS    RESTARTS   AGE
hello-00001-deployment-677f74cd-x4wzl   2/2     Running   0          48s
hello-00001-deployment-677f74cd-x4wzl   2/2     Terminating   0          73s
hello-00001-deployment-677f74cd-x4wzl   2/2     Terminating   0          73s
hello-00001-deployment-677f74cd-x4wzl   1/2     Terminating   0          93s
hello-00001-deployment-677f74cd-x4wzl   1/2     Terminating   0          103s
hello-00001-deployment-677f74cd-x4wzl   0/2     Completed     0          103s
hello-00001-deployment-677f74cd-x4wzl   0/2     Completed     0          103s
hello-00001-deployment-677f74cd-x4wzl   0/2     Completed     0          103s
```

### Traffic Splitting

#### Creating a New Revision

Apply a new version of hello-worl:

```bash
kubectl apply -f manifests/hello-updated.yaml
```

Check the updated service, the URL should stay the same since we are updating an existing Knative Service:

```bash
❯ k get ksvc
NAME    URL                                           LATESTCREATED   LATESTREADY   READY   REASON
hello   http://hello.default.192.168.1.221.sslip.io   hello-00002     hello-00002   True
```

We can view a list of existing Revisions with kubectl as follows:

```bash
❯ kubectl get revisions
NAME          CONFIG NAME   GENERATION   READY   REASON   ACTUAL REPLICAS   DESIRED REPLICAS
hello-00001   hello         1            True             0                 0
hello-00002   hello         2            True             0                 0
```

### Splitting Traffic Between Revisions

We can split traffic between the available revisions by adding a traffic field to the Knative Service, then reapplying the updated configuration:

```bash
kubectl apply -f manifests/hello-traffic.yaml
```
To verify we can access the Service URL from the terminal multiple times to see the traffic being split between the Revisions:

```bash
❯ for i in $(seq 1 4); do curl  http://hello.default.192.168.1.221.sslip.io; done
Hello Knative!
Hello World!
Hello World!
Hello Knative!
```
