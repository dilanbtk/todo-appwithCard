import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, Checkbox, DatePicker, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/tr'; // Import Turkish locale
import { db } from '../firebase'; // Adjust the path to your Firebase config file
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import EmojiPicker from 'emoji-picker-react';

const { Meta } = Card;

const TodoCard = ({ todo, onDelete, onUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [newDescription, setNewDescription] = useState(todo.description);
  const [completed, setCompleted] = useState(todo.completed);
  const [startDate, setStartDate] = useState(todo.startDate ? moment(todo.startDate.toDate()) : null);
  const [endDate, setEndDate] = useState(todo.endDate ? moment(todo.endDate.toDate()) : null);
  const [selectedEmoji, setSelectedEmoji] = useState(todo.emoji || ''); // Initialize emoji state with value from props
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const fetchEmoji = async () => {
      const todoDoc = await getDoc(doc(db, 'todos', todo.id));
      if (todoDoc.exists()) {
        const data = todoDoc.data();
        setSelectedEmoji(data.emoji || '');
      }
    };// end  fetchEmoji function for selected emoji  

    fetchEmoji();
  }, [todo.id]);//  fetchEmoji function when the todo id changes  

  const showModal = () => {
    setIsModalVisible(true);
  };// showModal function when the modal is visible

  const handleOk = async () => {
    try {
      const todoRef = doc(db, 'todos', todo.id); // reference to todo object    
      await updateDoc(todoRef, {
        title: newTitle,
        description: newDescription,
        startDate: startDate ? startDate.toDate() : null,
        endDate: endDate ? endDate.toDate() : null,
        emoji: selectedEmoji, // Save the selected emoji to Firebase
      });
      onUpdate(todo.id, newTitle, newDescription, completed, startDate, endDate, selectedEmoji);
      setIsModalVisible(false);
      message.success('Todo updated successfully!');
    } catch (error) {
      console.error("Error updating todo: ", error);
      message.error('Failed to update todo.');
    }
  }; // end handleOk function for updating todo with  new values 

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCheckboxChange = async (e) => {
    const newCompleted = e.target.checked;
    setCompleted(newCompleted);
    try {
      const todoRef = doc(db, 'todos', todo.id);
      await updateDoc(todoRef, { completed: newCompleted });
      message.success('Todo completion status updated!');
    } catch (error) {
      console.error("Error updating todo: ", error);
      message.error('Failed to update todo.');
    }
  };// update the completion status of the todo object  

  const handleEmojiClick = (emojiObject) => {
    setSelectedEmoji(emojiObject.emoji);
    setPickerVisible(false);
  };// handleEmojiClick function to set the selected emoji and hide the emoji picker  

  return (
    <>
      <Card
        hoverable
        style={{
          width: 400,
          marginBottom: 16,
          backgroundColor: '#E7E8D1',
          position: 'relative',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
        }}
        cover={<div style={{ height: 100, backgroundColor: '#D3C5E5' }}></div>}
      >
        <div style={{
          position: 'absolute',
          top: 8,
          left: 8,
          fontSize: '2.5rem', // Increased emoji size
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
          onClick={() => setPickerVisible(!pickerVisible)}
        >
          {selectedEmoji || ' '}
        </div>

        <Meta
          title={<span style={{ fontFamily: 'Dancing Script, cursive', textDecoration: completed ? 'line-through' : 'none' }}>{newTitle}</span>}
          description={<span style={{ fontFamily: 'Dancing Script, cursive', textDecoration: completed ? 'line-through' : 'none' }}>{newDescription}</span>}
        />
        <p className="mt-2 text-gray-500" style={{ fontFamily: 'Dancing Script, cursive', textDecoration: completed ? 'line-through' : 'none' }}>
          {todo.category}
        </p>
        <Checkbox
          checked={completed}
          onChange={handleCheckboxChange}
          style={{ fontFamily: 'Dancing Script, cursive', marginBottom: '8px' }}
        >
          {completed ? 'Completed' : 'Not Completed'}
        </Checkbox>
        <div style={{ position: 'absolute', top: 8, right: 8, textAlign: 'right' }}>
          <p style={{ marginBottom: 4, fontFamily: 'Dancing Script, cursive', color: '#333', fontSize: '0.875rem', textDecoration: completed ? 'line-through' : 'none' }}>
            Start: {startDate ? startDate.format('DD-MM-YYYY') : '...'}
          </p>
          <p style={{ fontFamily: 'Dancing Script, cursive', color: '#333', fontSize: '0.875rem', textDecoration: completed ? 'line-through' : 'none' }}>
            End: {endDate ? endDate.format('DD-MM-YYYY') : '...'}
          </p>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            gap: 8,
          }}
        >
          <Button
            shape="circle"
            icon={<EditOutlined />}
            style={{
              backgroundColor: 'transparent',
              color: '#000',
              border: 'none',
              boxShadow: 'none',
              fontFamily: 'Dancing Script, cursive',
            }}
            onClick={showModal}
          />
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            style={{
              backgroundColor: 'transparent',
              color: '#000',
              border: 'none',
              boxShadow: 'none',
              fontFamily: 'Dancing Script, cursive',
            }}
            onClick={() => onDelete(todo.id)}
          />
        </div>
      </Card>

      <Modal
        title="Edit Todo"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ fontFamily: 'Dancing Script, cursive' }}
      >
        <Input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="mb-2"
          style={{ fontFamily: 'Dancing Script, cursive' }}
        />
        <Input.TextArea
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="mb-2"
          style={{ fontFamily: 'Dancing Script, cursive' }}
        />
        <DatePicker
          placeholder="Start Date"
          value={startDate}
          onChange={(date) => setStartDate(date)}
          className="mb-2"
          style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1rem' }}
          format="DD-MM-YYYY" // Ensure the format is used for display
        />
        <DatePicker
          placeholder="End Date"
          value={endDate}
          onChange={(date) => setEndDate(date)}
          className="mb-2"
          style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1rem' }}
          format="DD-MM-YYYY" // Ensure the format is used for display
        />
      </Modal>

      {pickerVisible && (
        <div style={{ position: 'absolute', top: 32, left: 8, zIndex: 7 }}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </>
  );
};

export default TodoCard;
