import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Input, Button, Drawer, Alert, Select } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddTodo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      const todosSnapshot = await getDocs(collection(db, 'todos'));
      const todos = [];
      const categorySet = new Set();
      
      todosSnapshot.forEach((doc) => {
        const todo = { id: doc.id, ...doc.data() };
        todos.push(todo);
        categorySet.add(todo.category);
      });

      setAllTodos(todos);
      setCategories(Array.from(categorySet));
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filteredTodos = allTodos.filter((todo) =>
        todo.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredTodos);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allTodos]);

  const addTodo = async () => {
    if (!title || !category) {
      setAlertMessage('Title and Category are required!');
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }

    await addDoc(collection(db, 'todos'), {
      title,
      description,
      category,
    });
    setTitle('');
    setDescription('');
    setCategory('');
    setVisible(false); // Close the drawer after adding a todo
  };

  const searchTodos = async () => {
    if (searchResults.length === 0) {
      setAlertMessage('No matching todos found!');
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
    }
  };

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);
  const clearSearchResults = () => setSearchResults([]);

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleCategorySearch = (value) => {
    if (value && !categories.includes(value)) {
      setCategory(value);
    }
  };

  return (
    <>
      <div className=" absolute  top-4 right-4  flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-48"
          style={{ fontFamily: 'Dancing Script, cursive' }} // Apply handwritten font
        />
        <Button
          type="primary"
          style={{ backgroundColor: '#735DA5', borderColor: '#735DA5', marginLeft: '8px' }}
          icon={<SearchOutlined />}
          onClick={searchTodos}
        />
        <Button type="default" icon={<CloseOutlined />} onClick={clearSearchResults} />
      </div>

      {alertVisible && (
        <div className="fixed top-4 right-4">
          <Alert
            message={alertMessage}
            type="error"
            showIcon
            closable
            style={{ width: 200, fontFamily: 'Dancing Script, cursive' }}
          />
        </div>
      )}

      <button
        className="absolute top-4 left-4 flex flex-col justify-center items-center w-8 h-8"
        style={{ fontFamily: 'Dancing Script, cursive ' }}
        onClick={showDrawer}
      >
        <span className="block w-6 h-0.5 bg-black mb-1"></span>
        <span className="block w-6 h-0.5 bg-black mb-1"></span>
        <span className="block w-6 h-0.5 bg-black"></span>
      </button>
      <Drawer
        title="Add New Todo"
        placement="left"
        style={{ fontFamily: 'Dancing Script, cursive' }}
        onClose={onClose}
        open={visible}
        width={400}
      >
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2"
          style={{ fontFamily: 'Dancing Script, cursive' }} // Apply handwritten font
        />
        <Input.TextArea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-2"
          style={{ fontFamily: 'Dancing Script, cursive' }} // Apply handwritten font
        />
        <Select
          placeholder="Select or type a category"
          value={category}
          onChange={handleCategoryChange}
          onSearch={handleCategorySearch}
          showSearch
          allowClear
          className="mb-2"
          style={{
            fontFamily: 'Dancing Script, cursive',
            width: '100%', // Match the width of the title input
          }}
        >
          {categories.map((cat) => (
            <Option key={cat} value={cat}>
              {cat}
            </Option>
          ))}
          {category && !categories.includes(category) && (
            <Option key="new-category" value={category}>
              Add "{category}"
            </Option>
          )}
        </Select>
        <Button
          type="primary"
          style={{ backgroundColor: '#735DA5', fontFamily: 'Dancing Script, cursive', borderColor: '#735DA5', marginLeft: '8px' }}
          onClick={addTodo}
          block
        >
          Add Todo
        </Button>
      </Drawer>

      {searchResults.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4">
          {searchResults.map((todo) => (
            <div key={todo.id} className="bg-gray-200 p-4 shadow-md rounded-md flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: 'Dancing Script, cursive' }}>{todo.title}</h3>
                <p style={{ fontFamily: 'Dancing Script, cursive' }}>{todo.description}</p>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Dancing Script, cursive' }}>{todo.category}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 p-4" style={{ fontFamily: 'Dancing Script, cursive' }}>
          
        </div>
      )}
    </>
  );
};

export default AddTodo;
