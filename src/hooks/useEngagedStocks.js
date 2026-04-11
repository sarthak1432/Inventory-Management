import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  runTransaction, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../services/firebase';

export const useEngagedStocks = () => {
  const [engaged, setEngaged] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const engagedCollection = collection(db, 'engaged');
    const q = query(engagedCollection, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setEngaged(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const engageStock = useCallback(async (inventoryItem, quantity, type, note) => {
    const invRef = doc(db, 'inventory', inventoryItem.id);
    const engagedRef = doc(collection(db, 'engaged'));

    try {
      await runTransaction(db, async (transaction) => {
        const invDoc = await transaction.get(invRef);
        if (!invDoc.exists()) throw "Inventory item does not exist!";

        const currentQty = Number(invDoc.data().quantity || 0);
        if (currentQty < quantity) throw "Insufficient stock quantity!";

        transaction.update(invRef, {
          quantity: currentQty - quantity,
          updatedAt: serverTimestamp()
        });

        transaction.set(engagedRef, {
          inventoryId: inventoryItem.id,
          name: inventoryItem.name,
          department: inventoryItem.department,
          type, // 'in-use', 'sold', 'faulty'
          quantity: Number(quantity),
          note: note || '',
          timestamp: serverTimestamp()
        });
      });
    } catch (err) {
      console.error("Engagement Transaction Failed:", err);
      throw err;
    }
  }, []);

  const returnStock = useCallback(async (engagedItem) => {
    if (engagedItem.type !== 'in-use') throw "Only 'In-Use' items can be returned to stock!";

    const invRef = doc(db, 'inventory', engagedItem.inventoryId);
    const engagedRef = doc(db, 'engaged', engagedItem.id);

    try {
      await runTransaction(db, async (transaction) => {
        const invDoc = await transaction.get(invRef);
        
        if (invDoc.exists()) {
          const currentQty = Number(invDoc.data().quantity || 0);
          transaction.update(invRef, {
            quantity: currentQty + Number(engagedItem.quantity),
            updatedAt: serverTimestamp()
          });
        }
        
        transaction.delete(engagedRef);
      });
    } catch (err) {
      console.error("Return Transaction Failed:", err);
      throw err;
    }
  }, []);

  return { engaged, loading, engageStock, returnStock };
};
