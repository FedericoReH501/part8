const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { GraphQLError } = require("graphql")
const mongoose = require("mongoose")
const Author = require("./models/Author")
const Book = require("./models/Book")
const User = require("./models/User")
const jwt = require("jsonwebtoken")
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

      createUser(
        username: String!
        favoriteGenre: String!
      ): User

      login(
        username: String!
        password: String!
      ): Token
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
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }
  
  type Query {
    me: User
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

      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
      } catch (error) {
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
        await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          { new: true }
        )
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
    createUser: async (root, args) => {
      const newUser = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      return newUser.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = User.findOne({ username: args.username })
      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong Credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }
      const userForToken = { username: args.username, id: user._id }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
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
    me: async (root, args, context) => {
      return context.currentUser
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
  context: async (req, res) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
