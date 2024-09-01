require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// In-memory store for events
let eventsStore = [];

// Function to extract function names from the Solana program
const extractFunctionNames = (code) => {
  const functionNames = [];
  const functionRegex = /fn\s+(\w+)\s*\(/g;
  let match;
  while ((match = functionRegex.exec(code)) !== null) {
    functionNames.push(match[1]);
  }
  return functionNames;
};

// Function to extract event handlers from the Solana program
const extractEventHandlers = (code) => {
  const eventHandlers = [];
  const eventRegex = /(emit|msg)!\(\s*("[^"]+")\s*\)/g;
  let match;
  while ((match = eventRegex.exec(code)) !== null) {
    eventHandlers.push(match[1]);
  }
  return eventHandlers;
};

// Endpoint to handle the smart contract code
app.post('/api/smart-contract', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Smart contract code is required' });
  }

  try {
    const functions = extractFunctionNames(code);
    const events = extractEventHandlers(code);
    eventsStore = events; // Store events in the in-memory store
    return res.json({ functions, events });
  } catch (error) {
    console.error('Error processing Solana program:', error);
    return res.status(500).json({ error: 'Error processing Solana program' });
  }
});

// Endpoint to add an event
app.post('/api/add_event', (req, res) => {
  try {
    const { name, mid, arguments } = req.body;
    
    const newEvent = { name, mid, arguments };
    eventsStore.push(newEvent);

    console.log('Added new event:', newEvent);
    
    return res.status(200).json({ message: 'Event added successfully' });
  } catch (error) {
    console.error('Error adding event:', error);
    return res.status(500).json({ error: 'Error adding event' });
  }
});

// Endpoint to get events
app.get('/api/events', (req, res) => {
  try {
    return res.json(eventsStore);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Error fetching events' });
  }
});

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:5000`);
});
