const express = require('express');
const bodyParser = require('body-parser');
const { createTables, createCustomer, createRestaurant, fetchCustomers, fetchRestaurants, createReservation, destroyReservation } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

createTables();

// Routes
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await fetchCustomers();
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await fetchRestaurants();
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await fetchReservations();
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/customers/:id/reservations', async (req, res) => {
  try {
    const customerId = req.params.id;
    const { restaurant_id, date, party_count } = req.body;

    if (!restaurant_id || !date || !party_count) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const reservation = await createReservation(date, party_count, restaurant_id, customerId);
    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
  try {
    const customerId = req.params.customer_id;
    const reservationId = req.params.id;

    await destroyReservation(reservationId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
