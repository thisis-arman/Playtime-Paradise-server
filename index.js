const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config()
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))

// app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('PlayTime paradise serverrr');
});

console.log(process.env.DB_Username)

const uri = `mongodb+srv://${process.env.DB_Username}:${process.env.DB_Password}@cluster0.kwah0lw.mongodb.net/?retryWrites=true&w=majority`;

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
    const toyProductCollection = client.db('PlayTimeParadiseDB').collection('toyProduct')


    app.get('/toyproduct',async(req,res)=>{
        const result = await toyProductCollection.find({}).toArray()
        // const result = await productCollection.find().skip(skip).limit(limit).toArray();
        res.send(result)
    })
    app.get('/toyproduct/:id',async(req,res)=>{
        const id = req.params.id
        const query = {_id :new ObjectId(id)}
        const result = await toyProductCollection.findOne(query)
        res.send(result)

    })

app.post('/toyproduct',async(req,res)=>{
  const product = req.body;
  const result = await toyProductCollection.insertOne(product)
  res.send(result)
})


app.get("/mytoys", async (req, res) => {
  let query = {};
  if (req.query?.email) {
    query = { sellerEmail: req.query.email };
    
  }


  let sortOrder;
  console.log(req.query.sort);
  if (req.query?.sort === "highest") {
    sortOrder = -1;
  } else if (req.query?.sort === "lowest") {
    sortOrder = 1;
  }

  const result =await toyProductCollection.find(query).sort({price:sortOrder}).toArray()
  res.send(result);
})


app.get('/mytoys/:id',async(req,res)=>{
  const id = req.params.id;
  const filter = {_id:new ObjectId(id)}
  const result =await toyProductCollection.findOne(filter)
  res.send(result)
})



app.patch('/mytoys/:id',async(req,res)=>{
  const updateProduct =req.body;
  const id = req.params.id;
  const filter = {_id:new ObjectId(id)}
  const updateDoc ={
    $set:{
      status:updateProduct.status
    },
  }
  const result =await toyProductCollection.updateOne(filter, updateDoc)
  res.send(result)
  console.log(updateProduct);

})


  app.delete('/mytoys/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await toyProductCollection.deleteOne(query);
    res.send(result);
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


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});