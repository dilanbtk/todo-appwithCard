// src/components/TodoList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import TodoCard from './TodoCard';

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'todos'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosArray = []; // Array to store todos  
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray); 
    });

    return () => unsubscribe();
  }, []); // unsubscribe to the todos collection and update the todos state with the todos from the collection  

  return (
    <div>
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;
