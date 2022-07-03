const express = require('express')

const app = express()

app.get("/", (Request, Response)=>{
    return Response.json({message:"Ola mundo, eu estou funcionando"})
})

app.listen(3033, ()=>{
    console.log("Servidor Rodando")
})