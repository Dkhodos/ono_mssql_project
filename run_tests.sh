#!/bin/bash

cd .db
./start-sql-server.sh
cd ..

yarn test
