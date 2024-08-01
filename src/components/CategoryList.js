import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, deleteDoc, updateDoc, where, getDocs } from 'firebase/firestore';
import { message, Modal, Input} from 'antd';  // Import Modal and Input from antd
import CategoryCard from './CategoryCard';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'todos'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const categorySet = new Set();
      querySnapshot.forEach((doc) => {
        categorySet.add(doc.data().category);
      });
      setCategories([...categorySet]);
    }); 

    return () => unsubscribe();
  }, []); // unsubscribe  to the todos collection and update the categories state with the unique categories from the todos collection  
// subscribe  to the todos collection and update the categories state with the unique categories from the todos collection  

  const handleDelete = async (category) => {
    try {
      const q = query(collection(db, 'todos'), where('category', '==', category));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      message.success('Category deleted successfully');
    } catch (error) {
      message.error('Failed to delete category');
    }
  }; // end delete category function  

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setNewCategoryName(category);
    setIsModalVisible(true);
  }; // end handleEdit function 

  const handleOk = async () => {
    if (newCategoryName && newCategoryName !== currentCategory) {
      try {
        const q = query(collection(db, 'todos'), where('category', '==', currentCategory));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, { category: newCategoryName });
        });
        setIsModalVisible(false);
        message.success('Category updated successfully');
      } catch (error) {
        message.error('Failed to update category');
      }
    } else {
      message.warning('No changes made');
    }
  }; // end handleOk function for category update function  

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex flex-wrap justify-around">
      {categories.map((category, index) => (
        <CategoryCard
          key={index}
          category={category}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
      <Modal
        title="Edit Category"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Enter new category name"
        />
      </Modal>
    </div>
  );
};

export default CategoryList;
