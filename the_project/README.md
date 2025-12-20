# To-do Cronjob
Added a cronjob that runs every hour. It uses the `curlimages/curl` container to fetch a random Wikipedia article and add it to the todo list.

### Apply Manifest
```bash
kubectl apply -f the_project/manifests/cronjob.yaml
```
### Trigger Job
Manually create a job from the created cronjob:
```bash
kubectl create job --from=cronjob/todo-cron-job -n project todo-job
```

### Check Logs
```bash
kubectl logs -n project job/todo-job
```

Example Output:
```bash
Fetched URL: https://en.wikipedia.org/wiki/Doto_orcha
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   137 100    81 100    56  3063  2118  --:--:-- --:--:-- --:--:--  5269
{"id":4,"text":"Read https://en.wikipedia.org/wiki/Doto_orcha","completed":false}%
```
The todo item is added to the todo list.
```bash
http://ingress-ip/todos
```
Sample Output:
```json
[
  {
    "id": 1,
    "text": "Read https://en.wikipedia.org/wiki/Mario_Orfeo",
    "completed": false
  },
  {
    "id": 2,
    "text": "Read https://en.wikipedia.org/wiki/Sheriff_Isa",
    "completed": false
  },
  {
    "id": 3,
    "text": "Read https://en.wikipedia.org/wiki/Petar_Krsti%C4%87_(footballer)",
    "completed": false
  }
]
```