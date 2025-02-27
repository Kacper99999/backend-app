const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => {
    console.log('Połaczono z MongoDB!')
})
.catch((err) => {
    console.log('Bład połaczenia z MongoDB!', err)
})

app.use(express.json());

app.get('/',(req, res) => {
    res.send('server działą!')
});

app.get('/api/users',async(req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users)
    }
    catch(err){
        res.status(400).json({
            message:'Error fetching users',
            error:err.message
        })
    }
});

app.post('/api/users', async (req, res) => {
    const {name, email} = req.body;

    if(!name || !email){
        return res.status(400).json({message:'Name and email is required'});
    }

    const newUser = new User ({
        name,
        email
    });

    try{
        await newUser.save();
        res.status(201).json({
            message:'User created successfully!',
            user: newUser,
        });
    }
    catch(err){
        res.status(500).json({
            message:'Error creating user',
            error:err.message 
        });
    }
});

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if(!name || !email){
        res.status(400).json({message:"Name and email is requiered"});
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true }
        );

        if(!updatedUser){
            return res.status(404).json({message:'Not found'})
        }
        
        res.status(200).json({
            message:'User updated sucessfully!',
        user: updatedUser
    });
    }
    catch(err){
        res.status(500).json({
            message:'Error updating user',
            error:err.message
        });
    }
});

app.listen(PORT,()=> {
    console.log(`server działa na porcie ${PORT}`)
});