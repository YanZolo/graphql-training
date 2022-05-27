require("dotenv").config()
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLBoolean } = require("graphql");
const app = express();
const port = process.env.port || 8000;
const { authors, books } = require("./data");


const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: 'This is the author of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const BookType = new GraphQLObjectType({
    name: "Book",
    description: 'This is the book infos of an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
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
            resolve: () => books
        },
        book: {
            type: BookType,
            description: "single book",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                return books.find(book => book.id === args.id)
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "list of authors",
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: "single author",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                return authors.find(author => author.id === args.id)
            }
        },
    })
})

const rootMutation = new GraphQLObjectType({
    name: "Mutation",
    description: "root mutation",
    fields: () => ({
        addBook: {
            type: BookType,
            description: "add a book",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
                books.push(book)
                return book
            }
        },
        addAuthor: {
            type: AuthorType,
            description: "add an author",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const author = { id: authors.length + 1, name: args.name }
                authors.push(author)
                return author
            }
        },
        updateBook: {
            type: BookType,
            description: "update a book",
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString)
                },
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                const book = books.find(book => book.id === args.id);
                book.name = args.name;
                return book
            }
        },
        updateAuthor: {
            type: AuthorType,
            description: "update an author",
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString)
                },
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                const author = authors.find(author => author.id === args.id);
                author.name = args.name;
                return author;
            }
        },
        deleteBook: {
            type: GraphQLBoolean,
            description: "delete a book",
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: async (parent, args) => {
                const book = books.find(book => book.id === args.id)
                const bookIndex = books.indexOf(book)
                if (bookIndex === -1) {
                    throw new Error("Book with this id has not been found")
                }
                try {
                    books.splice(bookIndex, 1)
                    return true
                } catch (error) {
                    console.log({ message: error.message });
                }
            }
        },
        deleteAuthor: {
            type: GraphQLBoolean,
            description: "delete an author",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: async (parent, args) => {
                const authorIndex = authors.indexOf(authors.find(author => author.id === args.id))

                if (authorIndex === -1) {
                    throw new Error("Author with this id has not been found")
                }
                try {
                    authors.splice(authorIndex, 1)
                    return true
                } catch (error) {
                    console.log({ message: error.message });
                }
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation
})

app.use("/query", graphqlHTTP({
    schema: schema,
    graphiql: false
}))

app.use(express.static("public"))


app.listen(port, () => {
    console.log("server is listening at port:" + port);
})