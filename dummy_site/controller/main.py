import os
import time
from kubernetes import client, config, watch

# Use InCluster config if running in Pod, otherwise KubeConfig
try:
    config.load_incluster_config()
except:
    config.load_kube_config()

api = client.CustomObjectsApi()
apps_v1 = client.AppsV1Api()
core_v1 = client.CoreV1Api()

GROUP = "devopsk8s.dwk"
VERSION = "v1"
PLURAL = "dummysites"
NAMESPACE = "default" # Or watch all namespaces if ClusterRole

def create_resources(dummysite):
    name = dummysite['metadata']['name']
    namespace = dummysite['metadata']['namespace']
    website_url = dummysite['spec']['website_url']
    
    print(f"Creating resources for: {name}, URL: {website_url}")

    # Define Deployment
    deployment = client.V1Deployment(
        metadata=client.V1ObjectMeta(name=name, namespace=namespace),
        spec=client.V1DeploymentSpec(
            replicas=1,
            selector=client.V1LabelSelector(match_labels={"app": name}),
            template=client.V1PodTemplateSpec(
                metadata=client.V1ObjectMeta(labels={"app": name}),
                spec=client.V1PodSpec(
                    init_containers=[
                        client.V1Container(
                            name="fetcher",
                            image="curlimages/curl",
                            command=["/bin/sh", "-c"],
                            args=[f"curl -L {website_url} -o /work-dir/index.html"],
                            volume_mounts=[client.V1VolumeMount(name="work", mount_path="/work-dir")]
                        )
                    ],
                    containers=[
                        client.V1Container(
                            name="nginx",
                            image="nginx",
                            ports=[client.V1ContainerPort(container_port=80)],
                            volume_mounts=[client.V1VolumeMount(name="work", mount_path="/usr/share/nginx/html")]
                        )
                    ],
                    volumes=[
                        client.V1Volume(
                            name="work",
                            empty_dir=client.V1EmptyDirVolumeSource()
                        )
                    ]
                )
            )
        )
    )

    try:
        apps_v1.create_namespaced_deployment(namespace=namespace, body=deployment)
        print(f"Deployment {name} created.")
    except client.exceptions.ApiException as e:
        if e.status == 409:
            print(f"Deployment {name} already exists.")
        else:
            print(f"Failed to create deployment: {e}")

def main():
    print("Starting DummySite Controller...")
    w = watch.Watch()
    for event in w.stream(api.list_namespaced_custom_object, GROUP, VERSION, NAMESPACE, PLURAL):
        obj = event['object']
        kind = event['type']
        
        print(f"Event: {kind} {obj['metadata']['name']}")
        
        if kind == 'ADDED':
            create_resources(obj)

if __name__ == "__main__":
    main()
