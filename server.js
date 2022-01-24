const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('Welcome to Vidly :)');
});

app.get('/*', (req, res) => {
  res.status(404).send('Resource not found!');
});



app.listen(
  PORT, 
  () => console.log(`Server running on http://localhost:${PORT} . . .`)
);