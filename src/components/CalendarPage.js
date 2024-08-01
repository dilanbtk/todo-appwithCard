import React, { useState, useEffect } from 'react';
import { Calendar } from 'antd';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
    dayjs.extend(isBetween);
const CalendarPage = () => {
  const [todos, setTodos] = useState([]);

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
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  const getTodoColor = (startDate, endDate) => {
    const colors = ['#983e3e', '#8bbd78', '#a7cfe5', '#b3bec3', '#f5e8a3', '#e9818d', '#a9c3cb', '#cd97e0'];
    const diffDays = endDate.diff(startDate, 'day');
    return colors[diffDays % colors.length];
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
          {todosForDate.map((todo, index) => (
            <li key={index} style={{
              backgroundColor: getTodoColor(todo.startDate, todo.endDate),
              padding: '8px',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#333', 
              fontSize: '14px',
              fontWeight: 'bold', 
              lineHeight: '1.5',
              overflow: 'hidden',
              height: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxSizing: 'border-box'
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

