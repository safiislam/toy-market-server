const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
console.log(process.env.USER_NAME);
// middle were
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello henny bony");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.yrhbvyy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const toyCollection = client.db("toyDB").collection("allToy");
    // Connect the client to the server	(optional starting in v4.7)

    app.get('/alltoy',async (req,res)=>{
      const result = await toyCollection.find().limit(20).toArray()
      res.send(result)
    })
    app.get("/toy", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { sellerEmail: req.query.email };
      }

      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });
    app.put("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const toy = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set:{
          ...toy

        }
      }
      const result = await toyCollection.updateOne(filter,updateDoc,options)
      res.send(result)
    });
    app.delete('/toy/:id', async (req,res)=>{
      const id = req.params.id 
      const query = {_id : new ObjectId(id)}
      const result = await toyCollection.deleteOne(query)
      res.send(result)
    })
    app.post("/toy", async (req, res) => {
      const data = req.body;
      const result = await toyCollection.insertOne(data);
      res.send(result);
    });
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, (err) => {
  console.log(err);
});
