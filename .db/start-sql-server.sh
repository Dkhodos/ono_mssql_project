#!/bin/bash

# Take down the server
docker compose down

# Build and start the container in detached mode
docker compose up --build
