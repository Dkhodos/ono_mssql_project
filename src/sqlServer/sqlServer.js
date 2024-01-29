import sql from 'mssql';
import {randomUUID} from "crypto";
import {sleep} from "../utils/sleep.js";

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
    static #dbNumber = 0;

    #dbName;
    #pool
    constructor() {
        this.#pool = new sql.ConnectionPool(dbConfig);
        this.#pool.on('error', err => {
            console.error('SQL Pool Error:', err);
        });
    }

    async execute(query) {
        let transaction;
        try {
            await this.#connect();
            transaction = await this.#beginTransaction();
            const result = await this.#pool.request().query(query);
            await this.#commitTransaction(transaction);
            return result;
        } catch (err) {
            console.error('Error executing query:', err);
            if(transaction) await this.#rollbackTransaction(transaction)
            throw err;
        } finally {
            await this.#disconnect()
        }
    }

    async executeAll(queries) {
        let transaction;
        try {
            await this.#connect();
            transaction = await this.#beginTransaction();

            const results = [];
            for (const query of queries) {
                const result = await this.#pool.request().query(query);
                results.push(result);
            }

            await this.#commitTransaction(transaction);
            return results;
        } catch (err) {
            console.error('Error executing queries:', err);
            if (transaction) await this.#rollbackTransaction(transaction);
            throw err;
        } finally {
            await this.#disconnect();
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

    async #beginTransaction() {
        const transaction = new sql.Transaction(this.#pool);
        await transaction.begin();
        return transaction;
    }

    async #commitTransaction(transaction) {
        await transaction.commit();
    }

    async #rollbackTransaction(transaction) {
        await transaction.rollback();
    }
}
