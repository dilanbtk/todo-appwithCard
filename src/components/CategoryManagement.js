import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import CategoryCard from './CategoryCard';
import { Button, Drawer, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesArray = [];
      querySnapshot.forEach((doc) => {
        categoriesArray.push({ ...doc.data(), id: doc.id });
      });
      setCategories(categoriesArray);
    };

    fetchCategories();
  }, []); // fetch categories from the database and update the categories state accordingly when the component mounts itself  

  const handleAddCategory = async () => {
    if (!newName || !newColor) return;

    await addDoc(collection(db, 'categories'), {
      name: newName,
      color: newColor,
    });

    setNewName('');
    setNewColor('');
    setDrawerVisible(false); // Close the drawer after adding
  };// end handleAddCategory function for addCategory function  

  const handleUpdate = async (id, newName, newColor) => {
    const categoryRef = doc(db, 'categories', id);
    await updateDoc(categoryRef, {
      name: newName,
      color: newColor,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Manage Categories</h1>
      
      {/* Button to open the drawer */}
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={() => setDrawerVisible(true)}
        className="mb-4"
      >
        Add Category
      </Button>
      
      {/* Drawer for adding a new category */}
      <Drawer
        title="Add New Category"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        footer={
          <Button
            type="primary"
            onClick={handleAddCategory}
          >
            Add Category
          </Button>
        }
      >
        <Input
          type="text"
          placeholder="Category Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="mb-2"
        />
        <Input
          type="text"
          placeholder="Background Color (Hex Code)"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
        />
      </Drawer>

      <div className="flex flex-wrap justify-around">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
