import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");

  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      history.push(`/search/${query}`);
    } else {
      history.push("/");
    }
  };
  return (
    <form
      className="form-inline flex-nowrap bg-dark mx-lg-auto rounded p-1"
      onSubmit={handleSubmit}
    >
      <input
        className="form-control mr-sm-2"
        value={query}
        type="search"
        placeholder="Search"
        aria-label="Search"
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-raised btn-success my-2 my-sm-0" type="submit">
        Search
      </button>
    </form>
  );
};

export default Search;
