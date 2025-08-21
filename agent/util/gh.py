from agent.util.shell import run, have


def write_pr_body(text: str, path: str = "/tmp/pr_body.md"):
    heredoc = f"cat > {path} <<'EOF'\n{text}\nEOF"
    run(heredoc, check=True)


def create_pr(title: str, body: str):
    write_pr_body(body)
    if have("gh"):
        run(f'gh pr create --title {title!r} --body-file /tmp/pr_body.md', check=False)
    else:
        return {"skipped": True, "reason": "gh not found", "title": title}
