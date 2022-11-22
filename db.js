import mongoose from "mongoose";


const mongodb = mongoose;

await mongodb.connect(process.env.BD_LINK)
.then(() => {
     console.log('Conectado na base de dados');
})
.catch((err) => {
     console.log(err);
})


export default mongodb;