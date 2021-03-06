const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ServerDescriptionChangedEvent } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r0i0e.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        await client.connect(); 
        const database = client.db('carMechanic');
        const serviceCollection = database.collection('services');

        // GET API
            app.get('/services', async(req, res) =>{
                const cursor = serviceCollection.find({});
                const services = await cursor.toArray();
                res.send(services);
            });

            // GET A SINGLE ID
            app.get('/services/:id', async(req, res) =>{
                const id  = req.params.id;
                console.log('getting a specific id', id);
                const query = {_id: ObjectId(id)};
                const service = await serviceCollection.findOne(query);

                res.send(service);

            });

       
        // POST API
        app.post('/services', async(req, res) =>{
            const service = req.body;
            console.log('Hit the post', service);
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);

        }); 
        
        // DELETE API
        app.delete('/services/:id', async(req, res) =>{
            const id= req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })


    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Running genius car server')
});

app.get('/hello', (req, res) =>{
    res.send('heroku deploy here')
})

app.listen(port, ()=>{
    console.log('listen to genius car', port)
})