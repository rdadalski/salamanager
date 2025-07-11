import os
import subprocess

def count_lines_of_code():
    """
    This function counts the total number of lines of code in the 'api' and 'client'
    folders of a Git repository, excluding package.json files.

    It retrieves a list of all tracked files using `git ls-files` and then filters
    for files in the specified folders while excluding package.json files.

    **Note:** This method counts all lines, including comments and blank lines.
    """

    # Get list of files tracked by the Git repository
    result = subprocess.run(['git', 'ls-files'], capture_output=True, text=True)

    # Check if git command was successful
    if result.returncode != 0:
        print("Error: Not in a Git repository or git command failed")
        return

    files = result.stdout.splitlines()

    # Filter files to include only those in 'api' and 'client' folders
    # and exclude package.json files
    target_folders = ['api/', 'client/']
    filtered_files = []

    for file in files:
        # Check if file is in target folders
        if any(file.startswith(folder) for folder in target_folders):
            # Exclude package.json and pnpm-lock.yaml files
            if not (file.endswith('package.json') or file.endswith('pnpm-lock.yaml')):
                filtered_files.append(file)

    total_lines = 0
    processed_files = 0

    for file in filtered_files:
        try:
            # Check if file exists (in case it was deleted but still tracked)
            if os.path.exists(file):
                with open(file, 'r', errors='ignore') as f:
                    file_lines = sum(1 for _ in f)
                    total_lines += file_lines
                    processed_files += 1
                    print(f"{file}: {file_lines} lines")
        except Exception as e:
            print(f"Warning: Could not read {file}: {e}")

    print(f"\nProcessed {processed_files} files")
    print(f"Total lines of code: {total_lines}")

if __name__ == "__main__":
    count_lines_of_code()
