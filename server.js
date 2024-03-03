const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5002;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Pranay@2002',
  port: 5432,
});

app.get('/getRecords', async (req, res) => {
  try {
    const { page = 1, sortBy = 'created_at', sortOrder = 'asc', search } = req.query;
    const offset = (page - 1) * 20; // Define the offset here

    let query = `
      SELECT sno, customer_name, age, phone, location, 
      TO_CHAR(created_at, 'YYYY-MM-DD') as date, 
      TO_CHAR(created_at, 'HH24:MI:SS') as time 
      FROM customers
      `;

      if (search) {
        const searchTerm = '%' + search + '%'; // Adding wildcard for partial match
        query += ` WHERE customer_name ILIKE $1 OR location ILIKE $1`;
        // Use parameterized query to prevent SQL injection
        const result = await pool.query(query, [searchTerm]);
        res.status(200).json(result.rows);
      } else {
      // No search parameter provided, execute the query without filtering
      query += ` ORDER BY ${sortBy} ${sortOrder} LIMIT 20 OFFSET ${offset}`;
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    }
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
