const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i6c2rzu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const bookCollection = client.db('bookDB').collection('book');
    const userBookCollection = client.db('bookDB').collection('userBook');
    const userCollection = client.db('bookDB').collection('user');
    const borrowCollection = client.db('bookDB').collection('borrows');

    // user added book related apis 
    app.post('/userBook', async (req, res) => {
      const newBook = req.body;
      console.log(newBook);
      const result = await userBookCollection.insertOne(newBook);
      res.send(result);
    })

    app.get('/userBook', async (req, res) => {
      const cursor = userBookCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/userBook/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userBookCollection.findOne(query);
      res.send(result);
    })

    app.put('/userBook/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBook = req.body;
      const book = {
        $set: {
          select: updatedBook.select,
          image: updatedBook.image,
          name: updatedBook.name,
          quantity: updatedBook.quantity,
          author: updatedBook.author,
          description: updatedBook.description,
          rating: updatedBook.rating
        }
      }
      const result = await userBookCollection.updateOne(filter, book, options);
      res.send(result);
    })


    // borrow books apis 
    app.post('/borrows', async(req, res) => {
      const borrow = req.body;
      console.log(borrow);
      const result = await borrowCollection.insertOne(borrow);
      res.send(result);
    })


    app.get('/borrows', async(req, res) => {
      let query = {};
      if(req.query?.email){
        query = { email: req.query.email}
      }
      const result = await borrowCollection.find(query).toArray();
      res.send(result);
    })

    app.delete('/borrows/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id) };
      const result = await borrowCollection.deleteOne(query);
      res.send(result);
    })


    // book apis 
    app.get('/book', async (req, res) => {
      const cursor = bookCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/book/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.findOne(query);
      res.send(result);
    })

    app.get('/eachBook/:id', async(req, res) => {
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await bookCollection.findOne(query);
      res.send(result);
    })


    app.get('/fullDetails/:id', async(req, res) => {
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await bookCollection.findOne(query);
      res.send(result);
    })

    // user related apis 
    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 }); 
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close(); 
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Book wave Tech server is running')
});


app.listen(port, () => {
  console.log(`Book wave Tech server is running on port: ${port}`)
})
