// Database configuration
export const dbConfig = {
    user: 'sa',
    password: 'Admin123@@',
    server: 'localhost',
    database: 'master', // connecting to the master database
    options: {
        trustServerCertificate: true // required for self-signed certificates
    }
};
