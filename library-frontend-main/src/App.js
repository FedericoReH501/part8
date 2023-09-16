import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { gql, useQuery } from "@apollo/client";
const ALL_DATA = gql`
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
`;

const App = () => {
  const [page, setPage] = useState("authors");
  const response = useQuery(ALL_DATA);
  if (response.loading) {
    return <div>Loading...</div>;
  }
  console.log(response.data.allAuthors[0].name);
  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>
      <div></div>
      <Authors show={page === "authors"} data={response.data.allAuthors} />

      <Books show={page === "books"} data={response.data.allBooks} />

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
