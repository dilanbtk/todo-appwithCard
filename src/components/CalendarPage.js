import React, { useState, useEffect } from 'react';
import { Calendar } from 'antd';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const CalendarPage = () => {
  const [todos, setTodos] = useState([]);
  const [todoColors, setTodoColors] = useState({});

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'todos'));
        const todosData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            startDate: data.startDate ? dayjs(data.startDate.toDate()) : null,
            endDate: data.endDate ? dayjs(data.endDate.toDate()) : null
          };
        }).filter(todo => todo.startDate && todo.endDate);
        setTodos(todosData);

        // Generate and assign pastel colors for each todo
        const colors = {};
        todosData.forEach(todo => {
          colors[todo.id] = getPastelColor();
        });
        setTodoColors(colors);

      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  const getPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const pastel = `hsl(${hue}, 70%, 85%)`; // More pastel-like colors
    return pastel;
  };

  const cellRender = (current) => {
    const date = dayjs(current.format('YYYY-MM-DD'));
    const todosForDate = todos.filter(todo => {
      const startDate = todo.startDate;
      const endDate = todo.endDate;
      return startDate && endDate && date.isBetween(startDate, endDate, null, '[]');
    });

    return (
      <div style={{ height: '100%' }}>
        <ul className="events" style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {todosForDate.map((todo) => (
            <li key={todo.id} style={{
              backgroundColor: todo.completed ? '#f0f0f0' : todoColors[todo.id],
              padding: '8px',
              borderRadius: '8px',
              textAlign: 'center',
              color: todo.completed ? '#b0b0b0' : '#333', // Light gray color for completed todos
              fontSize: '14px',
              fontWeight: 'bold',
              lineHeight: '1.5',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxSizing: 'border-box',
              margin: '4px 0',
              textDecoration: todo.completed ? 'line-through' : 'none',
              textDecorationThickness: todo.completed ? '2px' : 'auto', // Thicker line-through
            }}>
              {todo.title}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff' }}>
      <h2 className="text-center mb-4" style={{ fontFamily: 'Dancing Script, cursive' }}>Task Calendar</h2>
      <Calendar cellRender={cellRender} />
    </div>
  );
};

export default CalendarPage;
