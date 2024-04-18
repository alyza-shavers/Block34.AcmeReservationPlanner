const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'your_database_connection_string_here',
});

// Method to create tables
async function createTables() {
  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS restaurants (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id UUID PRIMARY KEY,
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
        customer_id UUID REFERENCES customers(id) NOT NULL
      );
    `);
    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await client.end();
  }
}

// Method to create a customer
async function createCustomer(name) {
  try {
    await client.connect();
    const result = await client.query('INSERT INTO customers (id, name) VALUES (DEFAULT, $1) RETURNING *', [name]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Method to create a restaurant
async function createRestaurant(name) {
  try {
    await client.connect();
    const result = await client.query('INSERT INTO restaurants (id, name) VALUES (DEFAULT, $1) RETURNING *', [name]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Method to fetch all customers
async function fetchCustomers() {
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM customers');
    return result.rows;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Method to fetch all restaurants
async function fetchRestaurants() {
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM restaurants');
    return result.rows;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Method to create a reservation
async function createReservation(date, party_count, restaurant_id, customer_id) {
  try {
    await client.connect();
    const result = await client.query(
      'INSERT INTO reservations (id, date, party_count, restaurant_id, customer_id) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *',
      [date, party_count, restaurant_id, customer_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Method to destroy a reservation
async function destroyReservation(reservationId) {
  try {
    await client.connect();
    await client.query('DELETE FROM reservations WHERE id = $1', [reservationId]);
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation,
};
