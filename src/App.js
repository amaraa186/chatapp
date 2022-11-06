import logo from './logo.svg';
import './App.css';
// Import the functions you need from the SDKs you need
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { collection, getDocs, getFirestore, addDoc, query, orderBy, doc, onSnapshot } from "firebase/firestore";

import { Box, Flex, ScrollBoundaryContainer, Heading, TextField, Button, Modal, Layer,  CompositeZIndex, FixedZIndex, Text } from 'gestalt';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFbTgxETl6wN8pRZBrWLyOQZSgkNms6Lg",
  authDomain: "chat-6167e.firebaseapp.com",
  projectId: "chat-6167e",
  storageBucket: "chat-6167e.appspot.com",
  messagingSenderId: "58890991562",
  appId: "1:58890991562:web:adf2580547386de9650133"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage();
const db = getFirestore()

function App() {
  const [datas, setDatas] = useState([]);
  const [user, setUser] = useState();
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(true);
  const dataCollectionRef = collection(db, "messages");
  const q = query(collection(db, "messages"), orderBy("created_at", "asc"));
  const HEADER_ZINDEX = new FixedZIndex(10);
  const zIndex = new CompositeZIndex([HEADER_ZINDEX]);

  useEffect(() => {
    onGetDatas();
  }, [user])

  const onGetDatas = () => {
    onSnapshot(q, (snap) => {
      let array = [];
      snap.forEach((doc) => {
        array.push(doc.data())
      })
      setDatas(array);
    });
  }

  const onSendMessage = async () => {
    setMessage("");
    await addDoc(dataCollectionRef, {created_at: new Date(), name: user, text: message});
  }

  return (
    <Flex justifyContent="center" height="100%" width="100%">
      <Box color="infoBase" column={12}>
        <Box color="brand" paddingY={2} paddingX={2}>
          <Heading color='light'>Chat App</Heading>
        </Box>
        <Box color='default' height="86%">
          <ScrollBoundaryContainer>
            {
              datas.map((d) => (
                d.name != user && (                
                  <Box padding={3} column={3}>
                    <Text>{d.name}</Text>
                    <Box height={5} />
                    <Box color="infoBase" padding={2} rounding={2} display="inlineBlock">
                      <Text color='light'>{d.text}</Text>
                    </Box>
                  </Box>
                ) || (
                  <Box padding={3} marginStart="auto" column={3}>
                    <Text align='end'>{d.name}</Text>
                    <Box height={5} />
                    <Box display='flex' justifyContent='end'>
                      <Box color="infoBase" padding={2} rounding={2} display="inlineBlock">
                        <Text color='light'>{d.text}</Text>
                      </Box>
                    </Box>
                  </Box>
                )
              ))
            }
          </ScrollBoundaryContainer>
        </Box>
        <Box height={15} />
          <Flex alignItems="center" justifyContent='center'>
            <Box width="95%">
              <TextField 
                id="id"
                onChange={({value}) => setMessage(value)}
                value={message}
              />
            </Box>
            <Box width={10} />
            <Button text='Send' onClick={onSendMessage} />
          </Flex>
      </Box>
      {
        showModal == true && (
          <Layer zIndex={zIndex}>
            <Modal
              accessibilityModalLabel='modal'
              heading="Нэрээ оруулна уу"
            >
              <Box padding={4}>
                <TextField 
                  id="id"
                  onChange={({value}) => setUser(value)}
                />
                <Box height={10} />
                <Button text='enter' color="red" fullWidth onClick={() => {
                  user == undefined ? alert("Нэрээ оруулна уу") : setShowModal(false);
                }} />
              </Box>
            </Modal>
          </Layer>
        ) 
      }
    </Flex>
  );
}

export default App;
