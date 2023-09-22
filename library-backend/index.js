const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { v1: uuid } = require("uuid")
const { GraphQLError } = require("graphql")
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
    allBooks(author:String,genre:String): [Book]
    allAuthors: [Author]
  }


`

const resolvers = {
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })

      if (!author) {
        const newAuthor = new Author({ name: args.author })
        author = await newAuthor.save()
        const book = new Book({ ...args, author: author._id })
        try {
          await book.save()
        } catch (error) {
          console.log(error)
          await Author.findByIdAndDelete(author._id)
          throw new GraphQLError("title is not valid", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: error.path,
              error,
            },
          })
        }
        return book
      }

      console.log(author.name, author._id)
      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
      } catch (error) {
        console.log(error)
        throw new GraphQLError(`${error.path} is not valid`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: error.path,
            error,
          },
        })
      }
      return book
    },
    editAuthor: async (root, args) => {
      try {
        const author = await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          { new: true }
        )
        console.log("Updating the author", author)
      } catch (error) {
        throw new GraphQLError("Faild to set a new date!", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: error.path,
            error,
          },
        })
      }
    },
  },
  Query: {
    bookCount: async (root, args) => Book.collection.countDocuments(),
    authorCount: async (root, args) => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        const author = await Author.findOne({ name: args.author })

        return Book.find({ author: author._id }).populate("author")
      }
      if (args.genre) {
        return Book.find({ genres: args.genre })
      }
      let result = await Book.find({}).populate("author")
      return result
    },
    allAuthors: async (root, args) => {
      return Author.find({})
    },
  },

  Author: {
    bookCount: async (root, args) => {
      const books = await Book.find({ author: root._id })
      return books.length
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
