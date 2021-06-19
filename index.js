'use strict'
const mongoose = require("mongoose");
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolvers');
const jwt = require("jsonwebtoken");

require('dotenv').config({path: ".env"});

mongoose.connect(process.env.BBDD,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:true,
        useCreateIndex:true
    }, 
    (err, _) => {
        if(err){
            console.log("Error de conexión: "+err);
        }else{
            server();
        }
    }
);

function server() {
    const serverApollo = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req}) =>{
            const token = req.headers.authorization.split(' ')[1];
            if(token){
                try {
                    const user = jwt.verify(
                        token,
                        process.env.SECRET_KEY
                    );
                    return {user};
                } catch (error) {
                    console.log("#### ERROR ####");
                    console.log(error);
                    throw new Error("Token invalido");
                }
            }
        }
    });
    serverApollo.listen({port:process.env.port || 4000}).then(response => {
        console.log("Server running...\n"+response.url);
    });
}
