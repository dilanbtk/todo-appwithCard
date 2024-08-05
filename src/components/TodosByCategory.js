import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; // Firebase veritabanı ayarlarını içeren dosya
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'; // Firestore'dan veri almak ve güncellemek için gerekli fonksiyonlar
import TodoCard from './TodoCard'; // Todo kartını render etmek için bileşen

const TodosByCategory = ({ searchTerm }) => {
  const { category } = useParams(); // URL'den kategori bilgisi al
  const [todos, setTodos] = useState([]); // Todo'ları saklamak için durum değişkeni

  useEffect(() => {
    if (!category) return;

    const q = query(collection(db, 'todos'), where('category', '==', category));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
    }); //  Kategoriye göre todo'ları al ve durum değişkenini güncelle

    return () => unsubscribe();
  }, [category]);

  const filteredTodos = todos.filter(todo =>
    (todo.title ? todo.title.toLowerCase() : '').includes(searchTerm.toLowerCase())
  ); //  Arama terimine göre filtrele

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  const handleUpdate = async (id, newTitle, newDescription) => {
    const todoRef = doc(db, 'todos', id);
    await updateDoc(todoRef, {
      title: newTitle,
      description: newDescription,
    });
  };

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{category}</h1>
      <div className="flex flex-wrap justify-around" style={{ fontFamily: 'Dancing Script, cursive' }}>
        {filteredTodos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default TodosByCategory;
