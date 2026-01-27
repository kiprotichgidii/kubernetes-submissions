# Exercise 5.4: Wikipedia Loader

An application that serves Wikipedia pages using a multi-container Pod pattern.

## Architecture
- **Main Container**: Nginx (serves `/usr/share/nginx/html`).
- **Init Container**: Fetches "Kubernetes" wiki page on startup.
- **Sidecar Container**: Wakes up every 5-15 minutes, fetches a random Wikipedia page, and overwrites `index.html`.
- **Volume**: `emptyDir` shared between all containers.

## Deploy

```bash
kubectl apply -f wikipedia_loader/manifests/deployment.yaml
kubectl apply -f wikipedia_loader/manifests/service.yaml
kubectl apply -f wikipedia_loader/manifests/ingress.yaml
```

## Verify

1.  **Initial Load**: Access the service immediately. It should show the **Kubernetes** Wikipedia page.
    ```bash
    kubectl port-forward svc/wikipedia-loader-svc 8080:80 -n exercises
    # Visit http://localhost:8080
    ```

2.  **Update**: Wait (5-15 mins) or check the logs of the sidecar to see it updating.
    ```bash
    kubectl logs -l app=wikipedia-loader -c content-updater -n exercises -f
    ```
