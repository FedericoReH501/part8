import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { SET_YEAR, ALL_DATA } from "./queries"
const SetYear = (props) => {
  const [year, setyear] = useState("")
  const [name, setname] = useState("")
  const [editAuthor] = useMutation(SET_YEAR, {
    refetchQueries: [{ query: ALL_DATA }],
  })
  const submit = async (e) => {
    e.preventDefault()
    editAuthor({
      variables: {
        name: name,
        setBornTo: parseInt(year),
      },
    })
    setname("")
    setyear("")
  }
  const handleChange = (e) => {
    setname(e.target.value)
  }
  if (props.show) {
    return (
      <div>
        <h1>set year</h1>
        <form onSubmit={submit}>
          <div>
            <select onChange={handleChange}>
              {props.authors.map((a) => {
                return (
                  <option key={a.name} vale={a.name}>
                    {a.name}
                  </option>
                )
              })}
            </select>
          </div>

          <div>
            published
            <input
              type="number"
              value={year}
              onChange={({ target }) => {
                setyear(target.value)
              }}
            />
          </div>
          <button type="submit">set year</button>
        </form>
      </div>
    )
  }
}
export default SetYear
