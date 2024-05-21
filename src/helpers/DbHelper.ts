
//import { getFirestore, collection, doc, getDocs, getDoc, setDoc, updateDoc } from "firebase/firestore/lite";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, orderBy, Firestore, FirestoreDataConverter } from "firebase/firestore"; //updateDoc
import { Draw } from "./DrawHelper";

// Get a list of cities from your database
export const getDbList = async <DrawType extends Draw, >(db: Firestore, collectionName: string, converter: FirestoreDataConverter<DrawType>, sortByField: string, sortAscending: boolean) => {
  const colRef = collection(db, collectionName).withConverter(converter);
  const q = query(colRef, orderBy(sortByField, sortAscending?"asc":"desc"));
  const docsSnap = await getDocs(q);
  const list = docsSnap.docs.map(doc => doc.data());
  return list;
};

export const saveDbItem = async <DrawType extends Draw, >(db: Firestore, collectionName: string, item: DrawType, converter: FirestoreDataConverter<DrawType>) => {
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
  item.setDraw(updatedDocSnap.data() as DrawType);
};

export const getDbItem = async (db: Firestore, collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data;
  }
  return {};
};

export const deleteDbItem = async (db: Firestore, collectionName: string, id: string) => {
  await deleteDoc(doc(db, collectionName, id));
};