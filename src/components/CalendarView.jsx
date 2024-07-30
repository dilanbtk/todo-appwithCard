// src/components/CalendarView.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path to your Firebase config file

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);// Initialize events state

  useEffect(() => { // Fetch todos from Firestore
    const fetchTodos = async () => {
      const todosCollection = collection(db, 'todos');
      const todoSnapshot = await getDocs(todosCollection);
      const todos = todoSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      const events = todos
        .filter(todo => todo.startDate) // Filter out todos without a start date
        .map(todo => ({
          title: todo.title,
          start: todo.startDate.toDate(),
          end: todo.endDate ? todo.endDate.toDate() : todo.startDate.toDate(), // Use endDate if available
          allDay: true,
        }));

      setEvents(events);
    };  // Call fetchTodos function when component mounts itself  

    fetchTodos();
  }, []);

  return (
    <div style={{ height: '80vh' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>  // Render the Calendar component with events data and localizer
  );
};

export default CalendarView;
