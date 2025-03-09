const { urlencoded } = require("body-parser");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const PORT = 5000; 




app.get("/", (req, res) => {
    res.send("Hello World")
})
app.post('/use', (req,res)=> {
    const rese = req.body;
    console.log("name : " + rese.name)
    console.log("Password : " + rese.password)
    
})



app.listen(PORT, ()=> {
 console.log(`Server is running on Port ${PORT}`)
})
