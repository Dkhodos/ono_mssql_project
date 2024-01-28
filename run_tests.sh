#!/bin/bash

# Directory containing the test files
TEST_DIR="./src/__tests__"

# Loop through each test file in the directory
for file in "$TEST_DIR"/*
do
    # Check if the file is a regular file (and not a directory)
    if [ -f "$file" ]; then
        echo "Running tests in $file"
        # Run the test file with yarn
        yarn test "$file"
    fi
done
