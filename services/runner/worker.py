import dramatiq

@dramatiq.actor
def demo_run(cmd: str = "echo hello"):
    print("RUN:", cmd)
