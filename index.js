const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
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
  const placeOrderCollection = client.db("theBookHouse").collection("placeOrder");
  
  app.get('/allProducts', (req, res) => {
    bookCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })

  app.get('/product/:id', (req, res) => {
    bookCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, items) => {
      res.send(items[0]);
    })
  })

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    bookCollection.insertOne(newProduct)
    .then(result => {
      console.log(result);
      res.redirect('/')
    })
  })

  app.post('/orderPlace', (req, res) =>{
    const newOrder = req.body;
    placeOrderCollection.insertOne(newOrder)
    .then(result => {
      res.redirect('/')
    })
  })
  app.get('/allPlaceOrders', (req, res) => {
    placeOrderCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })

  app.delete('/orderDelete/:id', (req, res) =>{
    placeOrderCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>{
        res.send(result.deletedCount > 0);
    })
})
  
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})