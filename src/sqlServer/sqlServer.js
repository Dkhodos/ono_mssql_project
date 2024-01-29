import sql from 'mssql';
import {randomUUID} from "crypto";
import {dbConfig} from "./dbConfig.js";


export default class SqlServer {
    #dbName;
    #pool
    constructor() {
        this.#pool = new sql.ConnectionPool(dbConfig);
        this.#pool.on('error', err => {
            console.error('SQL Pool Error:', err);
        });
    }

    async execute(query) {
        try {
            await this.#connect();
            return await this.#pool.request().query(query);
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        } finally {
            await this.#disconnect()
        }
    }

    async #connect() {
        try {
            await this.#pool.connect();
            console.log('Connected to SQL Server');
        } catch (err) {
            console.error('Error connecting to SQL Server:', err);
            throw err;
        }
    }

    async #disconnect() {
        try {
            await this.#pool.close();
            console.log('Disconnected from SQL Server');
        } catch (err) {
            console.error('Error disconnecting from SQL Server:', err);
            throw err;
        }
    }

    async generateDB() {
        this.#dbName = this.#getNewDBName();
        await this.#createDatabase();
        await this.#useDatabase();
    }

    async #createDatabase() {
        await this.execute(`CREATE DATABASE ${this.#dbName}`);
    }

    async #dropDatabase() {
        await this.execute(`DROP DATABASE ${this.#dbName}`);
    }

    async #useDatabase() {
        this.#pool = new sql.ConnectionPool({
            ...dbConfig,
            database: this.#dbName,
        });
    }

    #getNewDBName(){
        const postfix = randomUUID().replaceAll("-", "_")
        return `db_${postfix}`;
    }
}
