import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { useQuery } from "@apollo/client"
import { ALL_DATA } from "./components/queries"
import SetYear from "./components/SetYear"
import Notify from "./components/Notify"
const App = () => {
  const [page, setPage] = useState("authors")
  const [notification, setNotification] = useState(null)
  const response = useQuery(ALL_DATA)
  const notify = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }
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
        authors={response.data.allAuthors}
        setError={notify}
      />
      <NewBook show={page === "add"} setError={notify} />
      <Notify notification={notification}></Notify>
    </div>
  )
}

export default App
