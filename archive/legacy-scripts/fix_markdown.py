#!/usr/bin/env python3
"""
Quick Markdown formatter to fix common linting issues
"""

import os
import re
from pathlib import Path

def fix_markdown_file(filepath):
    """Fix common markdown formatting issues"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    original_content = content
    
    # Fix blanks around headings - add blank line before headings if missing
    content = re.sub(r'(?<!\n\n)(\n#{1,6} )', r'\n\1', content)
    
    # Fix blanks around fenced code blocks
    content = re.sub(r'(?<!\n\n)(\n```)', r'\n\1', content)
    content = re.sub(r'(```\n)(?!\n)', r'\1\n', content)
    
    # Fix blanks around lists
    content = re.sub(r'(?<!\n\n)(\n- \[)', r'\n\1', content)
    content = re.sub(r'(?<!\n\n)(\n\d+\. )', r'\n\1', content)
    
    # Fix blanks around tables
    content = re.sub(r'(?<!\n\n)(\n\|)', r'\n\1', content)
    
    # Only write if content changed
    if content != original_content:
        print(f"Fixing: {filepath}")
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def main():
    project_root = Path("/home/lppoulin/nox-api-src")
    md_files = list(project_root.glob("*.md"))
    
    fixed_count = 0
    for md_file in md_files:
        if fix_markdown_file(md_file):
            fixed_count += 1
    
    print(f"\nFixed {fixed_count} markdown files")

if __name__ == "__main__":
    main()
