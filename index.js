const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;
const app = express();

if(process.env.NODE_ENV == 'production'){
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'index.html'))
    })
}
app.listen(port,()=>{
    console.log("Listning to port "+port);
})
