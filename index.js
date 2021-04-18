const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs-extra')
const fileUpload = require('express-fileupload')
const port = 5000

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('requirePic'));
app.use(fileUpload());

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ttm7i.mongodb.net/${process.env.DB_USER}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("pet-care").collection("services");
    const doctorCollection = client.db("pet-care").collection("doctors");
    const adminCollection = client.db("pet-care").collection("Admin");
    const customerCollection = client.db("pet-care").collection("customer");
    


    app.post('/addProducts', (req, res) => {
        const pic = req.files.file;
        const name = req.body.name;
        const type = req.body.type;
        const pair = req.body.pair;
        const price = req.body.price;

        const newImg = req.files.file.data;
        const encImg = newImg.toString('base64');
        const image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        }
        serviceCollection.insertOne({ image, name, type, pair, price })
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log('server connect successfully')
            })

    })

    app.post('/addDoctor', (req, res) => {
        const pic = req.files.file;
        const name = req.body.name;
        const email = req.body.email;

        const newImg = req.files.file.data;
        const encImg = newImg.toString('base64');
        const image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        }
        doctorCollection.insertOne({ image, name, email })
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log('server connect successfully')
            })

    })

    app.post('/addAdmin', (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        adminCollection.insertOne({ name, email })
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log('server connect successfully')

            })

    })

    app.get('/allAdmin', (req, res) => {
        adminCollection.find({})
            .toArray((err, admins) => {
                res.send(admins)
            })
    })

    app.delete('/allAdmin/:id', (req, res) => {
        adminCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(res.send(deleteCount > 0))
    })

    app.get('/allDoctors', (req, res) => {
        doctorCollection.find({})
            .toArray((err, doctors) => {
                res.send(doctors)
            })
    })

    app.delete('/allDoctors/:id', (req, res) => {
        doctorCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(res.send(deleteCount > 0))
    })

    app.get('/allProducts', (req, res) => {
        serviceCollection.find({})
            .toArray((err, pds) => {
                res.send(pds)
            })
    })

    app.delete('/allProducts/:id', (req, res) => {
        serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(res.send(deleteCount > 0))
    })




    app.post('/addCustomer', (req, res) => {
        console.log(req.body)
        const data =req.body
        customerCollection.insertOne({ data })
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log('server connect successfully')

            })

    })


});





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)