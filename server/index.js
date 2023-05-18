const keys = require('./keys')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
app.use(bodyParser.json())

const {Pool} = require('pg')

const pgClient = new Pool({
    user : keys.pgUser,
    host : keys.pgHost,
    database : keys.pgDatabase,
    password : keys.pgPassword,
    port : keys.pgPort
})

pgClient.on('connect',(client)=>{
    client.query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((e)=>console.log("Error in initiating postgres->",e))
})

app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.get('/values/all',async (req,res)=>{
    try {
        const values = await pgClient.query("SELECT * FROM values")
        res.status(200).send(values)
    } catch (error) {
        console.log("Error in gettingg values = > ",error.message)
    }
})

app.post('/values/add',async (req,res)=>{
    try {
        if(!req.body.value) res.status(200).send("msg:nmumber missing")

        pgClient.query("INSERT INTO values(number) VALUES($1)",[req.body.value])
        res.status(200).send("Value added")
    } catch (error) {
        console.log("Error in adding record = > ",error)
        
    }
})


app.listen(5000,()=>{
    console.log("Server started on port 5000")
})