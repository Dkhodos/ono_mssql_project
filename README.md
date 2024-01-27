# MSSQL Template Ono

This project sets up a Microsoft SQL Server instance using Docker and integrates with a Node.js application. 
It's designed to provide a quick start for projects requiring an MSSQL database.

## Prerequisites

- Docker and Docker Compose installed on your machine.
- Node.js version 18 or higher.

## Project Structure

- The database files are located in the `db` directory at the root of the project.
- The Node.js application files are located in the root directory.

## Setup

1. **Clone the Repository**

   Clone this repository to your local machine.

2. **Install Node Dependencies**

   Navigate to the project root and run:
   ```
   npm install
   ```
3. **Set Executable Permissions**

   Before running the scripts for the first time, set them as executable. Run:
   ```
   chmod +x start-sql-server.sh
   chmod +x connect_to_db.sh
   ```

4. **Start the MSSQL Server**

   Run the provided shell script to start the MSSQL server with Docker:
   ```
   ./start-sql-server.sh
   ```

   This will build and start the MSSQL Docker container in detached mode.

## Test Connecting to the Database via CLI

To connect to the MSSQL database, use the provided `connect_to_db.sh` script:

```
./connect_to_db.sh
```

## SQL client installation  (Azure Data Studio) ##
1. **Download SQL workbench workbench**
   - Go to: [Azure Data Studio Download](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio).
   - Click "Download Azure Data Studio".
   - Unzip and move to applications.

2. **Connect with Azure Data Studio**
   - Create new project.
   - Input the following (everything else keep default):
     - Connection Type: Microsoft SQL server.
     - Server: localhost,1433
     - Authentication type: SQL Login.
     - User name: sa
     - Password: Admin123@@

This script will facilitate connecting to your MSSQL instance.


## Additional Information

- The SQL Server is accessible on the default port `1433`.
- Modify the Docker and Docker Compose configurations as needed for your specific requirements.


