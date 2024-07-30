import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined} from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';
import { db } from '../firebase'; // Adjust the path as necessary
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

const { Meta } = Card;

const CategoryCard = ({ category, onDelete, onEdit }) => {
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
  
  const [todoCount, setTodoCount] = useState(0);

  useEffect(() => {
    const fetchEmoji = async () => {
      const emojiDoc = await getDoc(doc(db, 'categories', category));
      if (emojiDoc.exists()) {
   
     const data = emojiDoc.data();
        setSelectedEmoji(data.emoji || '');
      
      }
    };
    const fetchTodoCount = async () => {
      const q = query(collection(db, 'todos'), where('category', '==', category));
      const querySnapshot = await getDocs(q);
      setTodoCount(querySnapshot.size);
    };

    fetchEmoji();
    fetchTodoCount();
  }, [category]);

  const handleEmojiClick = async (emojiObject) => {
    setSelectedEmoji(emojiObject.emoji);
   
    setPickerVisible(false);

    await setDoc(doc(db, 'categories', category), {
      emoji: emojiObject.emoji,
      emojiName: emojiObject.names[0],
    });
  };

  const confirmDelete = async (category) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'Do you want to delete this category?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        await deleteDoc(doc(db, 'categories', category));
        onDelete(category);
      },
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      <Link to={`/category/${category}`}>
        <Card
          hoverable
          style={{
            width: 350,
            height: 200,
            marginBottom: 16,
            backgroundColor: '#E7E8D1',
            position: 'relative',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
          }}
          cover={
            <div style={{ height: 120, backgroundColor: '#D3C5E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Cover area content */}
            </div>
          }
        >
          <Meta
            title={
              <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Dancing Script, cursive' }}>
                <span>{category}</span>
              </div>
            }
          />
          <div style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            gap: 8,
          }}>
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
              onClick={(e) => {
                e.preventDefault();
                onEdit(category);
              }}
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
              onClick={(e) => {
                e.preventDefault();
                confirmDelete(category);
              }}
            />
          </div>
        </Card>
      </Link>

      <div style={{ 
        position: 'absolute', 
        top: 8, 
        left: 8, 
        fontSize: '3rem', // Increase emoji size
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer'
      }}
        onClick={() => setPickerVisible(!pickerVisible)}
      >
        {selectedEmoji || '+'}
      </div>

      <div style={{ 
        position: 'absolute', 
        top: 8, 
        right: 8, 
        fontSize: '1.5rem', // Todo count size
        display: 'flex', 
        alignItems: 'center'
      }}>
        <span style={{ fontFamily: 'Dancing Script, cursive', color: '#000' }}>
          {todoCount === 0 ? 'Complete' : todoCount}
        </span>
      </div>

      {pickerVisible && (
        <div style={{ position: 'absolute', top: 32, left: 8, zIndex: 7 }}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
