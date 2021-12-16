import { useState, useEffect } from "react";
import { db } from "./Firebase";
import { 
  collection, 
  getDocs, 
  addDoc,
  updateDoc,
  deleteDoc,
  doc, 
} from "firebase/firestore";

function App() {
  const emptyUserData = {
    email: "",
    fullname: "",
    password: "",
  };
  const [userData, setUserData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newUserData, setNewUserData] = useState(emptyUserData);
  const userCollectionRef = collection(db, "users");

  const handleChangeData = (event) => {
    setNewUserData({ ...newUserData, [event.target.name]: event.target.value});
  }

  const getUsers = async () => {
    const data = await getDocs(userCollectionRef);
    setUserData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handlePostUser = async () => {
    if (selectedUserId) {
      const userDoc = doc(db, "users", selectedUserId);
      await updateDoc(userDoc, newUserData);
    } else {
      await addDoc(userCollectionRef, newUserData);
    }
    getUsers();
    setNewUserData(emptyUserData);
    setSelectedUserId(null);
  }

  const handleDeleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    getUsers();
  };

  const handleCancelEdit = () => {
    setNewUserData(emptyUserData);
    setSelectedUserId(null);
  }

  useEffect(() => {
    getUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      setNewUserData(userData.filter((user) => user.id === selectedUserId)[0]);
    } else {
      setNewUserData(emptyUserData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  return (
    <div className="">
      <input
        placeholder="Email"
        name="email"
        onChange={handleChangeData}
        value={newUserData.email}
      />
      <input
        placeholder="Full Name"
        name="fullname"
        onChange={handleChangeData}
        value={newUserData.fullname}
      />
      <input
        placeholder="Password"
        name="password"
        onChange={handleChangeData}
        value={newUserData.password}
      />
      <button onClick={handlePostUser}>{selectedUserId ? "Update User" : "AddUser"}</button>
      {selectedUserId && <button onClick={handleCancelEdit}>Cancel</button>}
      {userData.map((user) => (
        <p key={user.id}>{user.email + " - " + user.fullname + " - " + user.password} <button onClick={() => {
          setSelectedUserId(user.id);
        }}>Edit User</button> <button onClick={() => { handleDeleteUser(user.id); }}>Delete User</button></p>
      ))}
    </div>
  );
}

export default App;
