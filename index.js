const express = require('express')
const app = express()
const port = 5000;
var cors = require('cors')
var bodyParser = require('body-parser')
// ObjectId = require('mongodb').ObjectID;


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.jyuwz.mongodb.net/doctorsDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const appointmentsCol = client.db("doctorsDB").collection("appointments");
  const appomntAddedByDocCol = client.db("doctorsDB").collection("appomntAddedByDocCol");

  const doctorsCol = client.db("doctorsDB").collection("doctors");
  const prescriptsCol = client.db("doctorsDB").collection("prescripts");
  const serviceCol = client.db("doctorsDB").collection("services");
  const doctorRegisteredCol = client.db("doctorsDB").collection("allDoctors");


  app.get('/', (req, res) => {
    res.send('Hello Whjhjhjhjorld!')
  })

  app.post('/addAppointment', (req, res) => {


    console.log(req.body);
    appointmentsCol.insertOne(req.body)
      .then(result => {
        res.send(result)
      })
  })
  app.post('/addNewService',(req,res)=>{

    serviceCol.insertOne(req.body)
    .then(result=>{res.send(result)})
  })
  app.post('/addNewDoctor',(req,res)=>{

    doctorRegisteredCol.insertOne(req.body)
    .then(result=>{res.send(result)})

  })
  
  app.post('/addPrescript', (req, res) => {
    // console.log(req.body)
    prescriptsCol.insertOne(req.body)
      .then(result => {
        res.send(result)
      })
  })
  
  
  app.post('/addAppmntByDoc', (req, res) => {
    // console.log(req.body)
    appomntAddedByDocCol.insertOne(req.body)
      .then(result => {
        res.send(result)
      })
  })



  app.put('/updateAppointment', (req, res) => {
    var convertedObjectid = ObjectId(req.body._id);
    
    appointmentsCol.updateOne(

      { _id: convertedObjectid },
      {
        $set: { prescriptionFlag: 1 }
      }
    )
      .then(result => {
        res.send({ modified: true })
      })
  })

  app.get('/getAppointments/:obj', (req, res) => {
    var receivedStringObj = req.params.obj;
    var jsonObj = JSON.parse(receivedStringObj);

    console.log(jsonObj);

    appointmentsCol.find(jsonObj).toArray((err, doc) => {
      console.log(doc)
      res.send(doc)
    })
  })

  app.get('/getPrescript/:_id', (req, res) => {
    prescriptsCol.find({_id: req.params._id}).toArray((err, doc) => {
      res.send(doc[0])
    })
  })

  app.get('/doctorlogin/:obj', (req, res) => {
    var receivedStringObj = req.params.obj;
    var jsonObj = JSON.parse(receivedStringObj);

    doctorsCol.find(jsonObj).toArray((err, doc) => {
      console.log(doc)
      res.send(doc[0])
    })
  })
  app.get('/getAllServices', (req, res) => {

    serviceCol.find({}).toArray((err,doc)=>{
      
      res.send(doc)
    })
  })

  app.get('/getAllAppointments', (req, res) => {
   
    appomntAddedByDocCol.find({}).toArray((err, doc) => {
      console.log(doc)
      res.send(doc)
    })
  })



});



app.listen(process.env.PORT || port);