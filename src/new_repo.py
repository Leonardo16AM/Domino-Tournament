import sys

def main():
    if len(sys.argv) < 2:
        print("Usage: new_repo.py <username>")
        sys.exit(1)

    username = sys.argv[1]
    print(f"Received username: {username}")

if __name__ == "__main__":
    main()
