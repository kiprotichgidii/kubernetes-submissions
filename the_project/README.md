# The Project
Exercise 3.9: DBaaS vs DIY


## Database Solutions Comparison: Cloud SQL vs. Self-Hosted Legacy

Comparison between using a managed Database as a Service (DBaaS) like Google Cloud SQL versus running a self-hosted PostgreSQL directly on GKE using PersistentVolumeClaims (PVC).

| Feature | Google Cloud SQL (DBaaS) | Self-Hosted GKE (StatefulSet + PVC) |
| :--- | :--- | :--- |
| **Initialization Work** | **Higher Complexity**: Requires enabling APIs, setting up VPC networking/Private Service Connect, creating instances via Terraform/Console, managing secrets/IAM, and running Cloud SQL Auth Proxy sidecars. | **Low Complexity**: Simple Kubernetes manifests (StatefulSet, PVC, Service). "Just works" within the cluster network. |
| **Maintenance** | **Zero/Low**: Managed by Google. Automatic OS updates, minor version upgrades, patching, and scaling. | **High**: You are responsible for OS patches, database version upgrades, performance tuning, and scaling (vertical/horizontal). |
| **Backups** | **Excellent**: Automated incremental backups and Point-in-Time Recovery (PITR) enabled by a simple checkbox. | **Manual**: You must set up CronJobs to run `pg_dump`, manage volume snapshots, and ensure off-site storage (GCS buckets). Harder to verify and restore. |
| **Costs** | **Higher Base Cost**: Hourly charge for instance + storage. Even small dedicated instances cost ~$50+/mo. High-availability (HA) doubles the cost. | **Low Base Cost**: You only pay for the Persistent Disk (storage) and potential node resource usage. Can be very cheap for small workloads. |
| **Ease of Usage** | **High**: Easy monitoring, cloning, and connecting via tools. | **Medium**: Standard Kubernetes interaction, but debugging storage issues or corrupted data files is complex. |

### Conclusion
- **Cloud SQL** is preferred for production environments where data integrity, automated backups, and reduced operational overhead are critical, and the higher cost is justified.
- **Self-Hosted** is suitable for development, testing, or small internal tools where cost optimization is the priority and you can tolerate the operational burden of managing your own database.

