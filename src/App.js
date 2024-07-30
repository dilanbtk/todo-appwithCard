import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner'; // Assumes you have a loading spinner component
import Navbar from './components/Navbar'; // Import the Navbar component

const AddTodo = lazy(() => import('./components/AddTodo'));
const CategoryList = lazy(() => import('./components/CategoryList'));
const TodosByCategory = lazy(() => import('./components/TodosByCategory'));
const CalendarPage = lazy(() => import('./components/CalendarPage'));

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value) => {
    setSearchTerm(value);
  };// handle search  function to update the searchTerm state with the search value and update the todos state with the filtered todos  

  return (
    <Router>
      <div className="bg-neutral-300 min-h-screen">
        <Navbar /> {/* Include the Navbar component here */}
        <div className="container mx-auto p-4 bg-neutral-300 text-black">
          <div className="mb-4 text-center">
            <div className="mb-4">
              <Suspense fallback={<LoadingSpinner />}>
                <AddTodo />
              </Suspense>
            </div>
            <div className="mb-4">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<CategoryList />} />
              <Route path="/category/:category" element={<TodosByCategory searchTerm={searchTerm} />} />
              <Route path="/calendar" element={<CalendarPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
};

export default App;
