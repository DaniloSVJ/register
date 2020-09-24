const express = require('express')
const {uuid} = require('uuidv4');
const { title } = require('process');

const app = express()
app.use(express.json()) //Por padrão o express não interpreta json. Por isso precisa coloca isso




function logRequest(request,response,next)
{
    const {method,url}= request;
    const logLabel = `[${method.toUpperCase()}] ${url}`

  
    console.time(logLabel)

     next();
   
}
const register = [];

app.get('/register',(request,response)=>{
    const {name}=request.query;
    const results = name
    ? register.filter(project=>project.name.includes(name))
    : register;
    return response.json(results)

})

app.post('/register',(request,response)=>{
   const {name,documentation,nationality} = request.body;
   const record = {id:uuid(),name,documentation,nationality}
   register.push(record)
   return response.json(register)

})

app.put('/register/:id',logRequest,(request,response)=>{
    const {id} = request.params;
    const {name,documentation,nationality} = request.body;
    const projectIndex = register.findIndex(project=>project.id===id)
    if (projectIndex<0){
        return response.status(400).json({error: 'Project not found'})
    }

    const record = {
        id,
        name,
        documentation,
        nationality
    }
    register[projectIndex] = record;

    return response.json(register)


})

app.delete('/register/:id',logRequest,(request,response)=>{
    const {id} = request.params;
    const projectIndex = register.findIndex(project=>project.id===id)

    if(projectIndex<0){
        return response.status(400).json({error:'Project not found'})   
    }
    register.splice(projectIndex,1)
    return response.status(204).send()
})

app.listen(3333)
