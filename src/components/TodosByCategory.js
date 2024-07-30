import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import TodoCard from './TodoCard';

const TodosByCategory = ({ searchTerm }) => {
  const { category } = useParams();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (!category) return;

    const q = query(collection(db, 'todos'), where('category', '==', category));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
    });

    return () => unsubscribe();
  }, [category]);

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex flex-wrap justify-around"
     style={{ fontFamily: 'Dancing Script, cursive' }} 
      >
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
