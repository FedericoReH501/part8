import { useState, useEffect } from "react"
import { LOGIN } from "./queries"
import { useMutation } from "@apollo/client"

const LoginForm = ({ show, setToken, setError, setShow }) => {
  const [username, setUsername] = useState("")
  const [password, setpassword] = useState("")
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    },
  })
  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value

      setToken(token)
      localStorage.setItem("token", token)
    }
  }, [result.data])

  if (!show) {
    return null
  }

  const submit = (e) => {
    e.preventDefault()
    login({ variables: { username, password } })
    setShow("authors")
  }
  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setpassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
