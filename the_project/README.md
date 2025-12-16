# To-do App with Backend Service

A simple to-do app that tracks your tasks and shows you a random image from Picsum every 10 minutes.
The application is now split into two microservices:
1. **Todo App (Frontend)**: Serves the HTML/JS and handles image caching.
2. **Todo Backend**: API service handling Todo items storage and retrieval.

Browser talks to `Todo App` for the UI and `Todo Backend` for `/todos` operations via Ingress.

## Build and Push Images

### Frontend (Todo App)
```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:2.2.1 \
  --push \
  .
```

### Backend (Todo Backend)
```bash
cd todo_backend
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t gedionkip/k8s-submissions:2.2.2 \
  --push \
  .
```

## Kubernetes Deployment

Create the `project` namespace:
```bash
kubectl create namespace project
```
Then apply the manifests:

```bash
# Apply Namespace and Manifests
kubectl apply -f manifests/
```

This will:
1. Create the `project` namespace.
2. Deploy the PVC, Deployment, Services, and Ingress into the `project` namespace.

## Access the application

The application is accessible via the Ingress Controller.

```bash
http://ingress-controller-ip/
```

![](./images/exercise-2-2.png)

- **UI**: `/` and `/image` are served by Todo App (frontend container).
- **API**: `/todos` is served by Todo Backend (backend container in the same pod).
