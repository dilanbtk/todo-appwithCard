import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results }) => {
  const navigate = useNavigate();

  const handleTodoClick = (category, id) => {
    navigate(`/category/${category}#${id}`);
  };

  return (
    <div>
      {results.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <ul>
          {results.map((todo) => (
            <li 
              key={todo.id} 
              className="cursor-pointer text-blue-500"
              onClick={() => handleTodoClick(todo.category, todo.id)}
            >
              {todo.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
