const express = require('express')
const {v4: uuidv4} = require('uuid')

const app = express()

app.use(express.json());

const contas=[];

function verificarConta(Request, Response, next){
    const { cpf}=Request.body
    const conta= contas.find(conta=>conta.cpf === cpf);

    if(conta){
        return Response.status(404).json({message:"Conta existente"})
    }

    return next()
}

app.get("/", (Request, Response)=>{
    return Response.json({message:"E aí parceiro! Voce acessou a FinanceAPI"})
})

app.post("/user", verificarConta,(Request, Response)=>{
    const { cpf, name}=Request.body

  

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

function verificarExtrato(Request, Response, next){
    const {cpf}= Request.params;
    const conta= contas.find(conta=>conta.cpf === cpf);

    if(!conta){
        return Response.status(404).json({message:"Conta não encontrada"})
    }

    Request.conta = conta

    return next()
}

function getBalanco(statement){
   const balance = statement.reduce((acomulador, operacao)=>{
        if(operacao.type==='credit'){
            return acomulador + operacao.valor
        }else{
            return acomulador - operacao.valor
        }
    },0);

    return balance;
}

app.get("/extrato/:cpf", verificarExtrato, (Request, Response)=>{
    const {conta}= Request

return Response.status(200).json(conta.statement)
});

app.post("/deposit/:cpf", verificarExtrato, (Request, Response)=>{
const {description, valor}=Request.body;

const {conta}=Request;

const statementOperation={
    description, 
    valor,
    creatDate: new Date(),
    type:'credit'
}

conta.statement.push(statementOperation);

return Response.status(201).json({message:"Deposito bem sucedido", conta})
})


app.post("/debito/:cpf",verificarExtrato,(Request, Response)=>{
const {valor}=Request.body;
const {conta}=Request;
 
const balance = getBalanco(conta.statement)

if(balance<valor){
    return Response.status(400).json({message:"Operação inválida"})
}

const statementOperation={
    description, 
    valor,
    creatDate: new Date(),
    type:'debit'
}

conta.statement.push(statementOperation);
return Response.status(201).send()
})

app.get("/statement/:cpf/:data", verificarExtrato, (Request, Response)=>{
const {conta}= Request;
const {data}= Request.query

const dateFormat = new Date(date + '00:00')

const statement = conta.statement.filter((statement)=>statement.created_at.toDateString()=== 
new Date(dateFormat).toDateString())

return Response.json(conta.statement)
})

app.delete("/conta/:cpf", verificarExtrato, (Request, Response)=>{
    const {conta}= Request;

    contas.splice(conta, 1);

    return Response.status(200).json({message:"Conta removida", contas})
    
    })
app.listen(3033, ()=>{
    console.log("Servidor Rodando")
})