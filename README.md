# MSSQL Ono SQL Project

This project is part of our SQL assignment in the Data Structures class at Ono Academic College. Its purpose is to:
- Create a work environment to experiment with different SQL queries.
- Establish a test environment to ensure the final queries are properly tested.

## Setup

### Prerequisites

- Docker Desktop or Docker CLI installed on your machine.
- Node.js version 18 or higher.

### Run a Local Azure SQL Server

1. **Clone the Repository**

   Clone this repository to your local machine.

2. **Validate Prerequisites**
   - Ensure Docker Desktop or Docker CLI is installed on your machine.
   - Verify the Docker engine is running.
   - Check that Node.js is installed on your machine and verify the version with the following command:
   ```js
    node -v
   ```
   
3. **Install the Yarn Package Manager**
    ```shell
   npm install -g yarn
    ```
   Alternatively, for systems requiring administrative privileges, use:
    ```shell
   sudo npm install -g yarn
    ```
   
4. **Install Node Dependencies**

   Navigate to the project's root directory and run:
   ```
   npm install
   ```
5. **Set Executable Permissions**

   Before running the scripts for the first time, ensure they have executable permissions. Execute the following commands:
   ```
   chmod +x start-sql-server.sh
   chmod +x connect_to_db.sh
   ```

6. **Start the MSSQL Server**

   Execute the provided shell script to start the MSSQL server using Docker:
   ```
   ./start-sql-server.sh
   ```

   This command builds and starts the MSSQL Docker container in detached mode.

### Test Connecting to the Database via CLI

To connect to the MSSQL database, use the `connect_to_db.sh` script:

```
./connect_to_db.sh
```

### SQL Client Installation (Azure Data Studio)
1. **Download Azure Data Studio**
   - Visit the [Azure Data Studio Download](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio) page.
   - Click on "Download Azure Data Studio".
   - Unzip the file and move it to your applications folder.

2. **Connect with Azure Data Studio**
   - Start a new project.
   - Enter the following details (leave everything else as default):
     - Connection Type: Microsoft SQL Server
     - Server: localhost,1433
     - Authentication Type: SQL Login
     - Username: sa
     - Password: Admin123@@

This process facilitates connecting to your MSSQL instance.

### Additional Information

- The SQL Server is accessible on the default port `1433`.
- You can modify the Docker and Docker Compose configurations as needed to meet your specific requirements.

## Project Structure

### Tests
1. 📁  `__tests__` - Contains Vitest test files for querying.
2. 📁 `dataGenerators` - ORM-like classes for generating insert queries for tests.
3. 📄 `vitest.config.ts` - Configuration file for Vitest.

### SQL Server
1. 📁 `sqlServer` - A class built to communicate with the local Docker-based Azure SQL Server.
2. 📁 `queries` - Contains text-based files with queries used in the test flow.

### CI
1. 📁 `.github` - Configures automatic CI for the project on every push.

### Running Tests
**Note**: Docker must be running for the tests to work!
Execute the tests using the following command for a UI interface:
```shell
yarn test:ui
```
Alternatively, for a command-line interface, use:
```shell
yarn test
```
