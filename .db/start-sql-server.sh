#!/bin/bash

# Function to check if Docker is running
is_docker_running() {
    docker info > /dev/null 2>&1
}

# Function to check if the mssql service is running
is_mssql_running() {
    docker-compose ps mssql | grep "Up" > /dev/null 2>&1
}

echo "Checking if Docker is running..."

# Check if Docker is inactive
if ! is_docker_running; then
    echo "Docker is down. Please start Docker and retry."
    # Note: Automatically starting Docker might not be possible due to macOS security constraints
else
    echo "Docker is already running."

    echo "Checking if mssql service is running..."
    if ! is_mssql_running; then
        echo "mssql service is down. Starting mssql service..."

        # Build and start the mssql service in detached mode
        docker-compose up --build -d mssql

        echo "Waiting for SQL server to start... (3s)"
        sleep 3
    else
        echo "mssql service is already running."
    fi
fi
