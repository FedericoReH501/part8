import { useState } from "react"
import { FILTERED_BOOKS } from "./queries"
import { useQuery } from "@apollo/client"
const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState("refactoring")
  const result = useQuery(FILTERED_BOOKS, { variables: selectedGenre })
  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>Loading.....</div>
  }
  const books = result.data.allBooks
  console.log("books", books)

  let genres = []
  if (props.data) {
    props.data.forEach((book) => {
      const bookGenres = book.genres
      bookGenres.forEach((genre) => {
        if (!genres.includes(genre)) {
          genres = genres.concat(genre)
        }
      })
    })
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => {
            return (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>Clear</button>
      </div>
    </div>
  )
}

export default Books
