require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/votre_base_de_données', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB établie'))
.catch(err => console.error('Erreur de connexion à MongoDB :', err));
