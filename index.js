const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-qhwzesf-shard-00-00.mrpyxhs.mongodb.net:27017,ac-qhwzesf-shard-00-01.mrpyxhs.mongodb.net:27017,ac-qhwzesf-shard-00-02.mrpyxhs.mongodb.net:27017/?ssl=true&replicaSet=atlas-4372m0-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/?retryWrites=true&w=majority`;

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

    const productCollection = client.db('emaJohnDB').collection('products');

    app.get('/products', async (req, res) => {
      // console.log(req.query)
      const page = parseInt(req.query.page)
      const size = parseInt(req.query.size)
      console.log(page, size)
      const result = await productCollection.find()
      .skip(page * size)
      .limit(size)
      .toArray();
      res.send(result);
    })

    app.post('/productByIds', async(req, res ) => {
      const ids = req.body;
      const idsWithObjectId = ids.map(id => new ObjectId(id))
      const query = {
        _id: {
          $in: idsWithObjectId
        }
      }
      const result = await productCollection.find(query).toArray()
      // console.log(idsWithObjectId)
      res.send(result)
    })

    app.get('/productsCount', async(req, res) => {
      const count = await productCollection.estimatedDocumentCount()
      res.send({count})
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('john is busy shoppingggg')
})

app.listen(port, () => {
  console.log(`ema john server is running on port: ${port}`);
})
