const express = require('express');
const mongoose = require('mongoose');
const cors= require('cors');
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mern')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String},
    description: String
});

const TodoModel = mongoose.model('Todo', todoSchema);


app.post('/todos', async(req, res) => {
    const {title,description}= req.body
    try {
        const newTodo = new TodoModel({title,description});
        await newTodo.save();
        res.status(201).json(newTodo);
        }
     catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }


})

app.get('/todos', async (req, res) => {
    try {
        const todos = await TodoModel.find();
        res.status(200).json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})


app.put("/todos/:id", async (req, res) => {
    try {
        const {title, description} = req.body;
        const id = req.params.id;
        const updatedTodo = await TodoModel.findByIdAndUpdate(
            id,
            { title , description},
            { new: true }
        )
    
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found"})
        }
        res.json(updatedTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }


})


app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await TodoModel.findByIdAndDelete(id);
        res.status(204).end();    
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
   
})

const port = 8000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});