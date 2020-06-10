//Here is the server for Rursus

const express = require('express');
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const mongoose = require( 'mongoose' );
const validateToken = require( './middleware/validateToken' );
const cors = require('./middleware/cors');
const { Activities } = require('./models/activityModel');
const { Tasks } = require('./models/taskModel');
const { Objectives } = require('./models/ObjectiveModel');

const {DATABASE_URL, PORT} = require( './config' );

const app = express();
const jsonParser = bodyParser.json();

app.use( cors );
app.use( express.static( "public" ) );
app.use( morgan( 'dev' ) );
//app.use( validateToken );


app.get('/all', (req, res) => {
    console.log('loading data ...');

    Activities.getAll()
        .then(activities => {

            Tasks.getAll()
                .then(tasks => {

                    Objectives.getAll()
                        .then(objectives => {
                            let activityArray = [];
                            let taskArray = tasks;
                            let objectiveArray = objectives;
                            let slice;
                            let sliceArray = [];


                            for (index in activities) {
                                activityArray[index] = {
                                    _id: activities[index]._id,
                                    name: activities[index].name,
                                    id: activities[index].id,
                                    tasks: [],
                                    objectives: []
                                };
                            }

                            

                            for (let i = 0; i < taskArray.length; i++) {
                                if (taskArray[i].activity) {//each that has a parent
                                    sliceArray = taskArray.splice(i, 1); //pop the kid out
                                    slice = sliceArray[0];
                                    for (index in activityArray) {//find its parent
                                       // console.log("looking for a parent for ",slice);
                                        if (activityArray[index].id == slice.activity.id) {
                                            //give the kid to daddy
                                           // console.log('found the parent');
                                            slice.activity = null;

                                            activityArray[index].tasks.push(slice);
                                            break;
                                        }
                                    }
                                    i--;
                                }
                            }
                            for (let i = 0; i < objectiveArray.length; i++) {
                                if (objectiveArray[i].activity) {//each that has a parent
                                    sliceArray = objectiveArray.splice(i, 1); //pop the kid out
                                    slice = sliceArray[0]
                                    for (index in activityArray) {//find its parent
                                        if (activityArray[index].id == slice.activity.id) {
                                            //give the kid to daddy
                                            slice.activity = null;
                                            activityArray[index].objectives.push(slice);
                                            break;
                                        }
                                    }
                                    i--;
                                }
                            }
                            const returnObject = {
                                activities: activityArray,
                                tasks: taskArray,
                                objectives:objectiveArray
                            }

                            return res.status(200).json(returnObject);

                        })
                        .catch(err => {
                            return res.status(500).end();
                        })




                })
                .catch(err => {
                    return res.status(500).end();
                })


        })
        .catch(err => {
            return res.status(500).end();
        })
        


    

});

app.get('/activity', jsonParser, (req, res) => {

    Activities.getOne(req.query.id)
        .then(result => {
            if (!result) {
                res.statusMessage = "Activity not found in database.";
                return res.status(404).end();
            }
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something's wrong with the Database.";
            return res.status(500).end();
        })

});

app.post('/task', jsonParser, (req, res) => {
    if (!req.body.activity || req.body.activity == null) {
        console.log("no parent");
        Tasks.upload({ id: req.body.id, name: req.body.name })
            .then(task => {
                return res.status(201).json(task);
            })
            .catch(err => {
                res.statusMessage = err.message;
                return res.status(400).end();
            })
    }
    else {
        const { id, name, activity } = req.body;

        Activities
            .getOne(activity)
            .then(activityres => {

                if (!activityres) {
                    Tasks.upload({ id: id, name: name })
                        .then(task => {
                            return res.status(201).json(task);
                        })
                        .catch(err => {
                            res.statusMessage = err.message;
                            return res.status(400).end();
                        })
                }
                else {
                    const newTask = {
                        id,
                        name,
                        activity: activityres._id
                    }

                    Tasks
                        .upload(newTask)
                        .then(task => {
                            return res.status(201).json(task);
                        })
                        .catch(err => {
                            res.statusMessage = err.message;
                            return res.status(400).end();
                        });
                }
            })
            .catch(err => {
                res.statusMessage = err.message;
                return res.status(400).end();
            });
    }
});



app.post('/objective', jsonParser, (req, res) => {
    if (!req.body.activity) {
        console.log("no activity");
        Objectives.upload({ id: req.body.id, name: req.body.name })
            .then(task => {
                return res.status(201).json(task);
            })
            .catch(err => {
                res.statusMessage = err.message;
                return res.status(400).end();
            })
    }
    else {
        const { id, name, activity } = req.body;

        Activities
            .getOne(activity)
            .then(activityres => {

                if (!activityres) {
                    Objectives.upload({ id: id, name: name })
                        .then(returned => {
                            return res.status(201).json(returned);
                        })
                        .catch(err => {
                            res.statusMessage = err.message;
                            return res.status(400).end();
                        })
                }
                else {
                    const newObjective = {
                        id,
                        name,
                        activity: activityres._id
                    }

                    Objectives
                        .upload(newObjective)
                        .then(objective => {
                            return res.status(201).json(objective);
                        })
                        .catch(err => {
                            res.statusMessage = err.message;
                            return res.status(400).end();
                        });
                }
            })
            .catch(err => {
                res.statusMessage = err.message;
                return res.status(400).end();
            });
    }
});

app.post('/activity', jsonParser, (req, res) => {
    let id = req.body.id;
    let name = req.body.name;

    let newObject = { name: name, id: id };

    Activities.upload(newObject)
        .then(result => {
            if (result.errmsg) {
                return res.status(409).end();
            }
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the Database. Try again later. " +
                err.message;
            return res.status(500).end();
        });

    //validations



});

//Or, post each as it is created.
app.post( '/postOne', jsonParser, ( req, res ) => {  //Run through the array on cliet side and post 9 times
    console.log( "Adding a new object to the list." );
    console.log( "Body ", req.body );

    let object_type = req.body['object_type'];
    let id = req.body.id;
    let name = req.body.name;
    let Oparent = req.body.Oparent;

    console.log(req.body);

    if (!id.length || !name.length || !object_type) {
        res.statusMessage = "One of these parameters is missing in the request: 'id', 'name', 'object_type', or 'Oparent'.";
        return res.status( 406 ).end();
    }

    //__Typeof validations here
    
    let newObject = { object_type, id, name, Oparent };

    MainObjects
        .createMainObject( newObject )
        .then( result => {
            // Handle id duplicate error
            if( result.errmsg ){
                res.statusMessage = "Faulty input. " +
                                    result.errmsg;
                return res.status( 409 ).end();
            }
            return res.status( 201 ).json( result ); 
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the Database. Try again later. " +
                                 err.message;
            return res.status( 500 ).end();
        });
});

app.delete( '/clearAll', ( req, res ) => {
    res.statusMessage = "Collections Cleared: ";
    Tasks.clearAll()
        .then(result => {
            res.statusMessage += "Tasks ";
        })
        .catch(err => { });
    Objectives.clearAll()
        .then(result => {
            res.statusMessage += "Objectives";
        })
        .catch(err => { });
    Activities.clearAll()
        .then(result => {
            res.statusMessage += "Activities"
        })
        .catch(err => { });

    return res.status(204).end();
});

app.listen( PORT, () => {
    console.log( "This server is running on port 8080" );

    new Promise( ( resolve, reject ) => {

        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        };
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });
});


// Base URL : http://localhost:8080/
// GET endpoint : http://localhost:8080/api/students
// GET by id in query : http://localhost:8080/api/studentById?id=123
// GET by id in param : http://localhost:8080/api/getStudentById/123


// Run mongo server
// brew services start mongodb-community
// mongod

// Use the mongo shell
// mongo




