from minio import Minio

class ArtifactStore:
    def __init__(self, endpoint, access_key, secret_key):
        self.client = Minio(
            endpoint,
            access_key=access_key,
            secret_key=secret_key,
            secure=False
        )

    def create_bucket(self, bucket_name):
        if not self.client.bucket_exists(bucket_name):
            self.client.make_bucket(bucket_name)

    def upload_artifact(self, bucket_name, object_name, file_path):
        self.client.fput_object(bucket_name, object_name, file_path)

    def get_artifact_url(self, bucket_name, object_name):
        return self.client.presigned_get_object(bucket_name, object_name)

# Example usage
# store = ArtifactStore("localhost:9000", "minioadmin", "minioadmin")
# store.create_bucket("logs")
# store.upload_artifact("logs", "example.log", "/path/to/example.log")
