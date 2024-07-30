import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path to your Firebase config file

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const todosSnapshot = await getDocs(collection(db, 'todos'));
      const todosData = todosSnapshot.docs.map(doc => ({
        ...doc.data(),
        start: doc.data().startDate.toDate(),
        end: doc.data().endDate.toDate(),
        title: doc.data().title,
      }));
      setEvents(todosData);
    };

    fetchTodos();
  }, []);

  return (
    <div className="h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Task Tracking Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
      />
    </div>
  );
};

export default CalendarComponent;
