const express = require("express");
const mainRouter=require("./routes/index");
const cors = require('cors');

const app=express();
app.use(express.json());
app.use(cors());

//this app.use, we use for middlewares to parse json files as well as here to route the requests going to a this specific route.
// its like asking all the requests coming to '/api/v1' to please go to mainRouter where they will be handled
app.use('/api/v1',mainRouter);

app.listen(3001);