import sql from 'mssql';

export const dbConfig = {
    user: 'sa',
    password: 'Admin123@@',
    server: 'localhost',
    database: 'master', // connecting to the master database
    options: {
        trustServerCertificate: true // required for self-signed certificates
    }
};

export default class SqlServer {
    constructor() {
        this.pool = new sql.ConnectionPool(dbConfig);
        this.pool.on('error', err => {
            console.error('SQL Pool Error:', err);
        });
    }

    async execute(query) {
        try {
            await this.#connect();
            return await this.pool.request().query(query);
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        } finally {
            await this.#disconnect()
        }
    }

    async #connect() {
        try {
            await this.pool.connect();
            console.log('Connected to SQL Server');
        } catch (err) {
            console.error('Error connecting to SQL Server:', err);
            throw err;
        }
    }

    async #disconnect() {
        try {
            await this.pool.close();
            console.log('Disconnected from SQL Server');
        } catch (err) {
            console.error('Error disconnecting from SQL Server:', err);
            throw err;
        }
    }
}
