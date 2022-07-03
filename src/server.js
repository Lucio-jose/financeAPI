const express = require('express')
const {v4: uuidv4} = require('uuid')

const app = express()

app.use(express.json());

const contas=[];

app.get("/", (Request, Response)=>{
    return Response.json({message:"Ola mundo, eu estou funcionando"})
})

app.post("/user", (Request, Response)=>{
    const { cpf, name}=Request.body

    const conta= contas.find(conta=>conta.cpf === cpf);

    if(conta){
        return Response.status(404).json({message:"Conta existente"})
    }

    contas.push({
        cpf,
        name,
        id: uuidv4(),
        statement:[]
    });

    return Response.status(201).json({messagem:"Usuario cadastrado",contas})
});

app.get("/users", (Request, Response)=>{
    return Response.json(contas)
});

app.get("/extrato/:cpf", (Request, Response)=>{
    const {cpf}= Request.params;

    const conta= contas.find(conta=>conta.cpf === cpf);

    if(!conta){
        return Response.status(404).json({message:"Conta não encontrada"})
    }

    return Response.status(200).json(conta.statement)
});


app.listen(3033, ()=>{
    console.log("Servidor Rodando")
})