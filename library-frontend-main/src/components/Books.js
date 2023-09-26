import { useState } from "react"

const Books = ({ show, data, setSelectedGenre }) => {
  if (!show) {
    return null
  }

  const books = data.allBooks
  const genres = data.allGenres
  console.log("genres", genres)

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
