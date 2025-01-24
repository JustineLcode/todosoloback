const { error } = require("console");
const express = require("express")
const { MongoClient, ObjectId } = require("mongodb")



// init app & middleware
const app = express()

app.use(express.json());

const cors = require("cors");
app.use(cors());

// db connection
let db
MongoClient.connect("mongodb+srv://justinelcode:TorvaldsBeCode24@cluster0.lezrh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then((client) => {
    db = client.db("todolist")
    })
.then(
    app.listen(3000, () => {
        console.log("Listening to port 3000")
    })
)
.catch((err) => console.log(err))

//routes
//GET ALL TASKS
app.get("/todos", (req, res) => {
let todos = []
db.collection("todos")
.find()
.sort( { _id : -1 })
.forEach(todo => todos.push(todo))
.then(()=> {
    console.log("Fetching ok");
    res.status(200).json(todos)
})
.catch((err)=> {
    console.log(err);
    res.status(500).json({error: "Could not fetch the documents"})
})
})

// GET A SINGLE TASK
app.get("/todos/:id", (req,res) => {
    if(ObjectId.isValid(req.params.id)){
    db.collection("todos")
    .findOne({_id: new ObjectId(req.params.id)})
    .then(task => {
        res.json(task)
    }).catch(err => {
        res.status(500).json({error: "Could not fetch the task"})
    })
} else {
    res.status(500).json({error: "The id is not valid"})
}
})

//POST TASK
app.post("/todos", (req, res)=>{
const newTask = req.body

db.collection("todos")
.insertOne(newTask)
.then((result)=> {
    console.log("Task added");
    res.json(result)
})
.catch((err)=> {
    console.log(err);
    res.status(500).json({error: "Could not add the task"})
})
})

//DELETE TASK
app.delete("/todos/:id", (req,res)=>{
const {id} = req.params;
if (ObjectId.isValid(id)) {
    db.collection("todos")
    .deleteOne({ _id: new ObjectId(id) })
    .then((result)=>{
        console.log("Task deleted")
        res.json(result)
    })
    .catch(err => {res.status(500).json({error: "Could not delete the task"})})
} else {
    res.status(500).json({error: "The id is not valid"})
}
})

//UPDATE TASK
app.patch("/todos/:id", (req,res)=>{
    const {id} = req.params;
    const updatedTask = req.body
    if (ObjectId.isValid(id)) {
        db.collection("todos")
        .updateOne({ _id: new ObjectId(id) }, { $set : updatedTask })
        .then((result)=>{
            console.log("Task updated")
            res.json(result)
        })
        .catch(err => {res.status(500).json({error: "Could not update the task"})})
    } else {
        res.status(500).json({error: "The id is not valid"})
    }
    })