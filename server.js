require("dotenv").config()
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } = require("graphql");
const app = express();
const port = process.env.port || 8000;
const data = require("./data");


const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: 'This is author of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
    })
})

const BookType = new GraphQLObjectType({
    name: "Book",
    description: 'This is infos of the book of an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return data.authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const rootQuery = new GraphQLObjectType({
    name: "Query",
    description: "Root query",
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: "list of books",
            resolve: () => data.books
        },
        author: {
            type: new GraphQLList(AuthorType),
            description: "list of authors",
            resolve: () => data.authors
        }
    })
})

const schema = new GraphQLSchema({
    query: rootQuery
})

app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(port, () => {
    console.log("server is listening at port:" + port);
})