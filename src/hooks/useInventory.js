import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export const useInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Create the collection reference inside the effect to avoid stale closures
        const inventoryCollection = collection(db, 'inventory');

        const unsubscribe = onSnapshot(
            inventoryCollection,
            (snapshot) => {
                const items = snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data(),
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
    }, []); // stable — no external deps

    const addItem = useCallback(async (newItem) => {
        try {
            // Check if item already exists in the same department (case-insensitive name)
            const existingItem = inventory.find(i => 
              i.name.toLowerCase() === newItem.name.toLowerCase() && 
              i.department === newItem.department
            );

            if (existingItem) {
                // If exists, increment quantity and update record
                const newQuantity = Number(existingItem.quantity || 0) + Number(newItem.quantity || 0);
                await updateDoc(doc(db, 'inventory', existingItem.id), {
                    ...newItem,
                    quantity: newQuantity,
                    updatedAt: serverTimestamp(),
                });
            } else {
                // If doesn't exist, create new record
                await addDoc(collection(db, 'inventory'), {
                    ...newItem,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
            }
        } catch (err) {
            console.error("Add/Update Item Error:", err);
            throw err;
        }
    }, [inventory]);

    const updateItem = useCallback(async (id, updates) => {
        try {
            await updateDoc(doc(db, 'inventory', id), {
                ...updates,
                updatedAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Update Item Error:", err);
            throw err;
        }
    }, []);

    const deleteItem = useCallback(async (id) => {
        try {
            await deleteDoc(doc(db, 'inventory', id));
        } catch (err) {
            console.error("Delete Item Error:", err);
            throw err;
        }
    }, []);

    return { inventory, loading, error, addItem, updateItem, deleteItem };
};
