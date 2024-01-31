#!/bin/bash

cd .db
./start-sql-server.sh
echo "Waiting for SQL server to start... (10s)"
sleep 10
cd ..

yarn test
