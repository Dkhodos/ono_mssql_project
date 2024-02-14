import {ConnectionPool} from 'mssql';
import {randomUUID} from "crypto";
import {dbConfig} from "./dbConfig.js";


export default class SqlServer {
    private dbName: string = "";
    private pool: any
    constructor() {
        this.pool = new ConnectionPool(dbConfig);
        this.pool.on('error', (err :string) => {
            console.error('SQL Pool Error:', err);
        });
    }

    async execute(query: string) {
        try {
            await this.connect();
            console.log(`executing query:\n${query}\n`);
            return await this.pool.request().query(query);
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        } finally {
            await this.disconnect()
        }
    }

    async generateDB() {
        this.dbName = this.getNewDBName();
        await this.createDatabase();
        await this.useDatabase();
    }

    private async connect() {
        try {
            await this.pool.connect();
            console.log('Connected to SQL Server');
        } catch (err) {
            console.error('Error connecting to SQL Server:', err);
            throw err;
        }
    }

    private async disconnect() {
        try {
            await this.pool.close();
            console.log('Disconnected from SQL Server');
        } catch (err) {
            console.error('Error disconnecting from SQL Server:', err);
            throw err;
        }
    }

    private async createDatabase() {
        await this.execute(`CREATE DATABASE ${this.dbName}`);
    }

    private async dropDatabase() {
        await this.execute(`DROP DATABASE ${this.dbName}`);
    }

    private async useDatabase() {
        this.pool = new ConnectionPool({
            ...dbConfig,
            database: this.dbName,
        });
    }

    private getNewDBName(){
        const postfix = randomUUID().replaceAll("-", "_")
        return `db_${postfix}`;
    }
}
