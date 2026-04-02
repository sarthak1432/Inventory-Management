import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const DEFAULT_DEPARTMENTS = [
  'AI Lab',
  '3D Section',
  'Service Lab',
  'Front Desk Area',
  "Mam's Cabin",
  'IT Department',
  'Classroom',
];

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const deptCollection = collection(db, 'departments');
    const q = query(deptCollection, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty && loading) {
        // Seed default departments if the collection is empty
        try {
          for (const name of DEFAULT_DEPARTMENTS) {
            await addDoc(deptCollection, {
              name,
              createdAt: serverTimestamp()
            });
          }
        } catch (err) {
          console.error("Error seeding departments:", err);
          setError(err.message);
        }
      } else {
        const deptList = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        setDepartments(deptList);
        setLoading(false);
      }
    }, (err) => {
      console.error("Firestore Departments Error:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loading]);

  const addDepartment = async (name) => {
    try {
      const deptCollection = collection(db, 'departments');
      await addDoc(deptCollection, {
        name,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Add Department Error:", err);
      throw err;
    }
  };

  const deleteDepartment = async (id) => {
    try {
      const deptRef = doc(db, 'departments', id);
      await deleteDoc(deptRef);
    } catch (err) {
      console.error("Delete Department Error:", err);
      throw err;
    }
  };

  return { departments, loading, error, addDepartment, deleteDepartment };
};
