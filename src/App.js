import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner'; // Assumes you have a loading spinner component
import Navbar from './components/Navbar'; // Import the Navbar component
import SearchResults from './components/SearchResults'; // Import the SearchResults component
import { db } from './firebase'; // Firebase veritabanı ayarlarını içeren dosya
import { collection, query, onSnapshot } from 'firebase/firestore'; // Firestore'dan veri almak için gerekli fonksiyonlar

const AddTodo = lazy(() => import('./components/AddTodo'));
const CategoryList = lazy(() => import('./components/CategoryList'));
const TodosByCategory = lazy(() => import('./components/TodosByCategory'));
const CalendarPage = lazy(() => import('./components/CalendarPage'));

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const q = query(collection(db, 'todos'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allTodos = [];
      querySnapshot.forEach((doc) => {
        allTodos.push({ ...doc.data(), id: doc.id });
      });

      const filteredResults = allTodos.filter(todo => 
        (todo.title ? todo.title.toLowerCase() : '').includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    });

    return () => unsubscribe();
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Router>
      <div className="bg-neutral-300 min-h-screen">
        <Navbar />
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
            <SearchResults results={searchResults} />
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
