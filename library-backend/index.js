const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { v1: uuid } = require("uuid")
const mongoose = require("mongoose")
const Author = require("./models/Author")
const Book = require("./models/Book")

mongoose.set("strictQuery", false)
require("dotenv").config()
const MONGODB_URI = process.env.MONGODB_URI
console.log("connecting to", MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message)
  })
let authors = []
let books = []

const typeDefs = `
    type Mutation{
      addBook(
        title: String!
        author: String!
        published: Int
        genres:[String]
        id: String
      ): Book
      
      editAuthor(
        name: String!
        setBornTo: Int!
      ): Author
    }
    
    type Author {
        name: String!
        id: ID!
        born: Int
        bookCount: Int
        
    }
    type Book {
      title: String
      published: Int
      author: Author!
      id: ID!
      genres:[String]
      
  }
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author:String): [Book]
    allAuthors: [Author]
  }


`

const resolvers = {
  Mutation: {
    addBook: (root, args) => {
      const book = { ...args, id: uuid() }
      if (!authors.find((a) => a.name === args.author)) {
        const author = { name: args.author, id: uuid() }
        authors = authors.concat(author)
      }
      books = books.concat(book)
      return book
    },
    editAuthor: (root, args) => {
      let author = authors.find((a) => a.name === args.name)
      if (!author) {
        return null
      }
      author = { ...author, born: args.setBornTo }
      authors = authors.map((a) => (a.name === author.name ? author : a))
      return author
    },
  },
  Query: {
    bookCount: async (root, args) => Book.collection.countDocuments(),
    authorCount: async (root, args) => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        console.log("im here!")
        const author = await Author.findOne({ name: args.author })
        console.log(author)
        return Book.find({ author: author._id }).populate("author")
      }
      if (args.genre) {
        result = Book.find({ author: args.author }).populate("author")
      }
      let result = await Book.find({}).populate("author")
      return result
    },
    allAuthors: async (root, args) => {
      return Author.find({})
    },
  },

  Author: {
    bookCount: (root, args) => {
      let count = 0
      books.forEach((book) => {
        if (book.author === root.name) {
          count += 1
        }
      })
      return count
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
