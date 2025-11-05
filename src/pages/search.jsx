import React from 'react';
import '../Search.css';

const Search = () => {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="form-control"
        placeholder="Search products..."
      />
    </div>
  )
}

export default Search;  