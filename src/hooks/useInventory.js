import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export const useInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const inventoryCollection = collection(db, 'inventory');

    useEffect(() => {
        // Real-time listener for the inventory collection
        const unsubscribe = onSnapshot(
            inventoryCollection,
            (snapshot) => {
                const items = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setInventory(items);
                setLoading(false);
            },
            (err) => {
                console.error("Firebase Error:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const addItem = async (item) => {
        try {
            await addDoc(inventoryCollection, {
                ...item,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Add Item Error:", err);
            throw err;
        }
    };

    const updateItem = async (id, updates) => {
        try {
            const itemRef = doc(db, 'inventory', id);
            await updateDoc(itemRef, {
                ...updates,
                updatedAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Update Item Error:", err);
            throw err;
        }
    };

    const deleteItem = async (id) => {
        try {
            const itemRef = doc(db, 'inventory', id);
            await deleteDoc(itemRef);
        } catch (err) {
            console.error("Delete Item Error:", err);
            throw err;
        }
    };

    return { inventory, loading, error, addItem, updateItem, deleteItem };
};
