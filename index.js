const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5011;


app.use(cors());
app.use(express.json());

// 
// 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hq29e8f.mongodb.net/?retryWrites=true&w=majority`;

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

    const userPostCollection = client.db('userPostDB').collection('post');
    const userCommentCollection = client.db('userPostDB').collection('comment')

    app.post('/posts', async(req, res)=> {
        const user = req.body;
        const result = await userPostCollection.insertOne(user);
        res.send(result)
        console.log(result)
    })

    app.get('/posts', async(req, res)=>{
        const result = await userPostCollection.find().toArray();
        res.send(result);
    })

    app.post('/comments', async(req, res)=> {
        const comment = req.body;
        const result = await userCommentCollection.insertOne(comment)
        res.send(result);
        console.log(result);
    })
    app.get('/comments', async(req, res)=> {
        const result = await userCommentCollection.find().toArray();
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



app.get('/', (req, res)=>{
    console.log('My Post Site Is running')
})

app.listen(port, ()=>{
    console.log(`Post Site running Server ${port}`)
})