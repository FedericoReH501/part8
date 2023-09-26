import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { useQuery, useApolloClient } from "@apollo/client"
import { ALL_DATA, FILTERED_BOOKS } from "./components/queries"
import SetYear from "./components/SetYear"
import Notify from "./components/Notify"
import LoginForm from "./components/LoginForm"
import Reccomended from "./components/Recommended"
const App = () => {
  const [page, setPage] = useState("authors")
  const [notification, setNotification] = useState(null)
  const [token, setToken] = useState(null)
  const [filter, setFilter] = useState(null)
  const [selectedGenre, setSelectedGenre] = useState(null)

  const client = useApolloClient()
  const response = useQuery(ALL_DATA)
  const bookResponse = useQuery(FILTERED_BOOKS, {
    variables: { genre: selectedGenre },
  })
  const notify = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }
  if (response.loading || bookResponse.loading) {
    return <div>Loading...</div>
  }
  const allGenres = (book) => {
    let genres = []
    bookResponse.data.allBooks.forEach((book) => {
      const bookGenres = book.genres
      bookGenres.forEach((genre) => {
        if (!genres.includes(genre)) {
          genres.push(genre)
        }
      })
    })
    return genres
  }
  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {localStorage.getItem("token") ? (
          <div>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("set")}>set year</button>
            <button onClick={() => setPage("recomended")}>recomended</button>
            <button
              onClick={() => {
                setToken(null)
                localStorage.clear()
                client.resetStore()
              }}
            >
              log out
            </button>
          </div>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} data={response.data.allAuthors} />
      <Books
        show={page === "books"}
        setSelectedGenre={setSelectedGenre}
        data={{
          allBooks: bookResponse.data.allBooks,
          allGenres: allGenres(bookResponse.data.allBooks),
        }}
      />
      <SetYear
        show={page === "set"}
        authors={response.data.allAuthors}
        setError={notify}
      />
      <NewBook show={page === "add"} setError={notify} />
      <LoginForm
        show={page === "login"}
        setError={notify}
        setToken={setToken}
        setShow={setPage}
      ></LoginForm>
      <Reccomended show={page === "recomended"}></Reccomended>
      <Notify notification={notification}></Notify>
    </div>
  )
}

export default App
