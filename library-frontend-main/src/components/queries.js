import { gql } from "@apollo/client"
export const ALL_DATA = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`
export const FILTERED_BOOKS = gql`
  query filterBooksByGenre($genre: String) {
    allBooks(genre: $genre) {
      title
      genres
      author {
        name
      }
      published
    }
  }
`

export const CREATE_BOOK = gql`
  mutation addBook(
    $title: String!
    $published: Int
    $author: String!
    $genres: [String]
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      genres
    }
  }
`
export const SET_YEAR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      id
    }
  }
`
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
