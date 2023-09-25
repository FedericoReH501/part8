import { useState } from "react"
const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  if (!props.show) {
    return null
  }
  const filterGenre = (genre) => {
    setSelectedGenre(genre)
  }
  const books = selectedGenre
    ? props.data.filter((book) => book.genres.includes(selectedGenre))
    : props.data

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
          <div>
            {genres.map((genre) => (
              <td key={genre}>
                <button onClick={() => setSelectedGenre(genre)}>{genre}</button>
              </td>
            ))}
            <button onClick={() => setSelectedGenre(null)}>Clear</button>
          </div>
        </tbody>
      </table>
    </div>
  )
}

export default Books
