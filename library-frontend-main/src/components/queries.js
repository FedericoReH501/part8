import { gql } from "@apollo/client"
export const ALL_DATA = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
    allBooks {
      title
      author
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
