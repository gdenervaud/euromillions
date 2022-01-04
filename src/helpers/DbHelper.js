
//import { getFirestore, collection, doc, getDocs, getDoc, setDoc, updateDoc } from "firebase/firestore/lite";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, orderBy } from "firebase/firestore"; //updateDoc

// Get a list of cities from your database
export const getDbList = async (db, collectionName, converter, sortByField, sortAscending) => {
  const colRef = collection(db, collectionName).withConverter(converter);
  const q = query(colRef, orderBy(sortByField, sortAscending?"asc":"desc"));
  const docsSnap = await getDocs(q);
  const list = docsSnap.docs.map(doc => doc.data());
  return list;
};

export const saveDbItem = async (db, collectionName, item, converter) => {
  const docRef = doc(db, collectionName, item.id).withConverter(converter);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    if (!data.lastUpdated || (item.lastUpdated && item.lastUpdated >= data.lastUpdated)) {
      //await updateDoc(docRef, item);
      await setDoc(doc(db, collectionName, item.id).withConverter(converter), item);
    }
  } else {
    await setDoc(doc(db, collectionName, item.id).withConverter(converter), item);
  }
  const updatedDocSnap = await getDoc(docRef);
  item.setDraw(updatedDocSnap.data());
};

export const getDbItem = async (db, collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data;
  }
  return {};
};

export const deleteDbItem = async (db, collectionName, id) => {
  await deleteDoc(doc(db, collectionName, id));
};