const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());

if(process.env.NODE_ENV == 'production'){
    app.use(express.static('portfolio'));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'portfolio','index.html'))
    })
}
app.listen(port,()=>{
    console.log("Listning to port "+port);
})
