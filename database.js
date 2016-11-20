const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/biblereading';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE readinglog (name varchar(255),log text,data BIGINT);');
query.on('end', () => { client.end(); });
