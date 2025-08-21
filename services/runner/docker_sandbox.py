import docker

def run_in_container(image: str, cmd: str):
    client = docker.from_env()
    c = client.containers.run(
        image,
        cmd,
        detach=True,
        network_disabled=True,
        mem_limit="2g",
        nano_cpus=1_000_000_000,
        remove=True,
    )
    return c.logs().decode()
