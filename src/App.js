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
  const [searchResults, setSearchResults] = useState([]);//  SearchResults bileşenindeki sonuçları saklamak için durum değişkeni
  const [searchTerm, setSearchTerm] = useState(''); // Arama terimini saklamak için durum değişkeni

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    } //  searchTerm boşsa, sonuçları sıfırla ve fonksiyondan çık 

    const q = query(collection(db, 'todos'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allTodos = [];
      querySnapshot.forEach((doc) => {
        allTodos.push({ ...doc.data(), id: doc.id });
      }); //  Tüm todo'ları al ve allTodos dizisine ekle

      const filteredResults = allTodos.filter(todo => 
        (todo.title ? todo.title.toLowerCase() : '').includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    }); //  Arama terimine göre filtrele ve sonuçları güncelle

    return () => unsubscribe();
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  }; //  Arama terimini güncellemek için bir fonksiyon

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
