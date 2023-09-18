import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { useQuery } from "@apollo/client"
import Notify from "./components/Notify"
import { ALL_DATA } from "./components/queries"
import SetYear from "./components/SetYear"

const App = () => {
  const [page, setPage] = useState("authors")
  const [notification, setNotification] = useState({
    message: null,
    errorMessage: null,
  })
  const response = useQuery(ALL_DATA)
  if (response.loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("set")}>set year</button>
      </div>
      <div></div>
      <Authors show={page === "authors"} data={response.data.allAuthors} />

      <Books show={page === "books"} data={response.data.allBooks} />
      <SetYear
        show={page === "set"}
        setError={notify}
        authors={response.data.allAuthors}
      />
      <NewBook show={page === "add"} setError={{ notify }} />
    </div>
  )
}

export default App
