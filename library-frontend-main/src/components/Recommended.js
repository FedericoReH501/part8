import { useState } from "react"
import { ME } from "./queries"
import { useQuery, useApolloClient } from "@apollo/client"

const Reccomended = (props) => {
  const response = useQuery(ME)

  if (!props.show) {
    return null
  }
  if (response.loading) {
    return <div>Loading...</div>
  }

  const books = response.data.me.favoriteGenre
    ? props.data.filter((book) =>
        book.genres.includes(response.data.me.favoriteGenre)
      )
    : props.data

  return (
    <div>
      <h2>Recommended</h2>
      <h4> Favorite: {response.data.me.favoriteGenre}</h4>

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
    </div>
  )
}
export default Reccomended
