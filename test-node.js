const { Client } = require('pg');

const client = new Client({
  host: 'localhost', // Database host
  port: 5432,        // MySQL default port
  user: 'postgres', // Replace with your actual MySQL username
  password: 'pgpass',             // Replace with your actual MySQL password
  database: 'ikizcurtaincom_ikiz_shop', // Replace with your database name
});

(async () => {
  try {
    // Attempt to connect to the database
    await client.connect();
    console.log('Connected to the database successfully!');

    // Optionally, test a query
    const res = await client.query('SELECT NOW() AS current_time');
    console.log('Database Response:', res.rows[0]);

    // Disconnect from the database
    await client.end();
  } catch (err) {
    console.error('Failed to connect to the database:', err.message);
  }
})();
