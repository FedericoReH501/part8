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
const shower = async () => {
  console.log("shower")
  const data = await Book.find({})
  console.log(data)
}
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB")
    shower()
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
    allBooks: [Book]
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
    bookCount: (root, args) => books.length,
    authorCount: (root, args) => authors.length,
    allBooks: async (root, args) => {
      return Book.find({}).populate("author")
      if (!args) {
        const bookssss = await Book.find({})
        console.log(bookssss)
        return Book.find({})
      }
      let result = books

      if (args.author) {
        result = books.filter((b) => b.author === args.author)
      }
      if (args.genre) {
        result = result.filter((b) => b.genres.includes(args.genre))
      }

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

shower
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
