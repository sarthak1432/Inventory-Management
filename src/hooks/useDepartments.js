import { useState, useEffect, useRef, useCallback } from 'react';
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

// Module-level collection reference — stable across renders
const deptCollection = collection(db, 'departments');
const deptQuery = query(deptCollection, orderBy('createdAt', 'asc'));

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref guard prevents the seeding logic from running more than once
  const seeded = useRef(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(deptQuery, async (snapshot) => {
      if (snapshot.empty && !seeded.current) {
        seeded.current = true; // guard against double-fire
        try {
          for (const name of DEFAULT_DEPARTMENTS) {
            await addDoc(deptCollection, {
              name,
              createdAt: serverTimestamp()
            });
          }
          // Snapshot will re-fire after seeding — loading handled there
        } catch (err) {
          console.error("Error seeding departments:", err);
          setError(err.message);
          setLoading(false);
        }
      } else if (!snapshot.empty) {
        const deptList = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          name: docSnap.data().name,
          head: docSnap.data().head || ''
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
  }, []); // stable — no reactive deps needed

  const addDepartment = useCallback(async (name) => {
    try {
      await addDoc(deptCollection, {
        name,
        head: '',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Add Department Error:", err);
      throw err;
    }
  }, []);

  const updateDepartment = useCallback(async (id, updates) => {
    try {
      await updateDoc(doc(db, 'departments', id), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Update Department Error:", err);
      throw err;
    }
  }, []);

  const deleteDepartment = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'departments', id));
    } catch (err) {
      console.error("Delete Department Error:", err);
      throw err;
    }
  }, []);

  return { departments, loading, error, addDepartment, updateDepartment, deleteDepartment };
};
