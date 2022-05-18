const express = require('express')
const app = express()
const port = 5000;
var cors = require('cors')
var bodyParser = require('body-parser')


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
 const addReviewInAppointment = client.db("doctorsDB").collection("reviewForAppointment");
 const reviewsCol = client.db("doctorsDB").collection("reviews");
 const blogsCol = client.db("doctorsDB").collection("blogs");


  app.get('/', (req, res) => {
    res.send('Hello Whjhjhjhjorld!')
  })

  app.post('/addAppointment', (req, res) => {
    // console.log(req.body);
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

  app.post('/addReviewInAppointment', (req, res) => {
    // console.log(req.body)
    addReviewInAppointment.insertOne(req.body)
      .then(result => {
        res.send(result)
      })
  })

  app.post('/addReview', (req, res) => {
    // console.log(req.body)
    reviewsCol.insertOne(req.body)
      .then(result => {

        res.send(result)
      })
  })

  app.post('/addBlog', (req, res) => {
    // console.log(req.body)
    blogsCol.insertOne(req.body)
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
  });

  
  // app.get('/getServiceFromAppointmentId/:appointmentId', (req, res) => {
  //   var convertedObjectid = ObjectId(req.body.appointmentId);
    
  //   console.log(convertedObjectid);
  //   appointmentsCol.find({_id:convertedObjectid}).toArray((err, doc) => {
      
  //     res.send(doc)
  //   })

  // });

  app.get('/getAppointments/:obj', (req, res) => {
    var receivedStringObj = req.params.obj;
    var jsonObj = JSON.parse(receivedStringObj);

    // console.log(jsonObj);

    appointmentsCol.find(jsonObj).toArray((err, doc) => {
      
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
      // console.log(doc)
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
      // console.log(doc)
      res.send(doc)
    })
  })
  
  app.get('/getReviewInfo/:_id', (req, res) => {
    addReviewInAppointment.find({appmntId: req.params._id}).toArray((err, doc) => {
      // console.log(doc)
      res.send(doc)
    })
  })

  app.get('/getReviews/:_id', (req, res) => {

    var convertedObjectid = ObjectId(req.params.id);    

    reviewsCol.find({docsAppmntId: req.params._id}).toArray((err, doc) => {
      res.send(doc)
    })
  })


  app.get('/getAppmntAddedByDoc/:id', (req, res) => {
        
    var convertedObjectid = ObjectId(req.params.id);


    appomntAddedByDocCol.find({_id: convertedObjectid}).toArray((err, doc) => {
      // console.log(doc)
      res.send(doc[0])
    })
  })
  
  app.get('/getServiceName/:_id', (req, res) => {

    var convertedObjectid = ObjectId(req.params._id);    

    serviceCol.find({_id: convertedObjectid}).toArray((err, doc) => {
      res.send(doc[0])
    })
  })

  app.get('/getDoctorDetails/:docEmail', (req, res) => {

    var convertedObjectid = ObjectId(req.params._id);    

    doctorRegisteredCol.find({docEmail: req.params.docEmail}).toArray((err, doc) => {
      res.send(doc[0])
    })
  })


   app.get('/getAllBlogs', (req, res) => {
   
    blogsCol.find({}).toArray((err, doc) => {
      // console.log(doc)
      res.send(doc)
    })
  })



});



app.listen(process.env.PORT || port);