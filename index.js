const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skqkk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


client.connect(err => {
  const bookCollection = client.db("theBookHouse").collection("products");
  
  app.get('/allProducts', (req, res) => {
    bookCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    bookCollection.insertOne(newProduct)
    .then(result => {
      console.log(result);
      res.send(result.insertedCount > 0);
    })
  })
  
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})