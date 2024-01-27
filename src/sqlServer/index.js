import sql from 'mssql';

export default class SqlServer {
    constructor(config) {
        this.pool = new sql.ConnectionPool(config);
        this.pool.on('error', err => {
            console.error('SQL Pool Error:', err);
        });
    }

    async connect() {
        try {
            await this.pool.connect();
            console.log('Connected to SQL Server');
        } catch (err) {
            console.error('Error connecting to SQL Server:', err);
            throw err;
        }
    }

    async execute(query) {
        try {
            await this.connect();
            return await this.pool.request().query(query);
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        } finally {
            this.pool.close();
        }
    }

    async disconnect() {
        try {
            await this.pool.close();
            console.log('Disconnected from SQL Server');
        } catch (err) {
            console.error('Error disconnecting from SQL Server:', err);
            throw err;
        }
    }
}
