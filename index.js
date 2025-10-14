const express= require('express');
const app=express();
const fileUpload = require("express-fileupload");
const PORT=3005;
require('./config/connectdb').connectdb();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
const apiRouter = require('./router/userRouter');

app.use('/api',apiRouter);
app.get('/',(req,res)=>
{
    res.send('created');
})
app.listen(PORT,()=>
{
    console.log(`SERVER WILL BE RUNNING AT  http://localhost:${PORT}/`);
});