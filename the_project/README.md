## Exercise 4.3: Prometheus 

### Prometheus Installation

Install Prometheus with helm as follows:
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack --namespace prometheus --create-namespace
```
### Port-Forwad
Port-forward the service to access it via localhost:
```bash
kubectl port-forward -n prometheus svc/prometheus-kube-prometheus-prometheus 9090:9090
```
### Query
Query the number of pods created by StatefulSets in the `prometheus` namespace:
```bash
sum(kube_pod_info{namespace="prometheus", created_by_kind="StatefulSet"})
```
![](./images/prometheus-query.png)