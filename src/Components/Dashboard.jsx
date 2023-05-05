import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import { 
    Button, 
    Container, 
    Nav, 
    Row, 
    Navbar, 
    NavDropdown, 
    Figure,
    Table,
    Form
    } from 'react-bootstrap'
import {  useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, onSnapshot, doc, query, updateDoc } from 'firebase/firestore'

export default function Dashboard() {
    const [error, setError] = useState('');
    const navigate = useNavigate()
    const { logout, currentUser } = useAuth()

    // logout the current user----------------------------
    async function handleLogout(){
        setError('')
        try{
            await logout()
            navigate('/login')
        }catch (error){
            setError(error)
        }
    }
      
    const [addReminder, setAddReminder] = useState([])
    const [reminder, setReminder] = useState("")
    const clearInput = useRef(null)

    // create a reference to the reminders collection for the current user
    const remindersRef = query(collection(db, `users/${currentUser.uid}/reminders`));

    // add reminder to Firestore -----------------------------
    const addReminderToFirestore = async (newReminder) => {
        try {
            await addDoc(remindersRef, newReminder);
        } catch (error) {
            console.log(error.message)
        }
    };
    
    // load reminders from Firestore-----------------------------------
    useEffect(() => {
        const unsubscribe = onSnapshot(remindersRef, (snapshot) => {
            const reminders = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAddReminder(reminders);
        });
        return () => unsubscribe();
    }, [remindersRef]);
    
    // add reminders to dashboard--------------------------------------
    const onSubmit = async (e) =>{
        e.preventDefault();
        const currentTime = new Date().toLocaleTimeString();
        const currentDate = new Date().toLocaleDateString();
        const newReminder ={
            reminder,
            date: currentDate,
            time: currentTime,
            status: false
        }
        setAddReminder([...addReminder, newReminder])
        addReminderToFirestore(newReminder); 
        clearInput.current.value="";
        setReminder("");
    }
    
    // delete reminder-------------------------------------------  
    const deleteReminder = async (id) =>{
        setAddReminder(addReminder.filter(r => {
            return r !== id;
        }))
        await deleteDoc(doc(db, `users/${currentUser.uid}/reminders/${id}`));
    }

    // update reminder status in Firestore ----------------------
    const updateReminderStatus = async (id, status) => {
        try {
          await updateDoc(doc(db, `users/${currentUser.uid}/reminders/${id}`),{
            status: status
          })
        } catch (error) {
          console.log(error.message);
        }
    };

  return (
    <>    
    <Container fluid>
        <Row >
            <Navbar bg="dark" expand="lg" variant='dark' style={{padding:'10px'}}>
                <Navbar.Brand href="#home">Reminders</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className='justify-content-between'>
                    <Nav className="">
                        <Nav.Link href="#home" active>Home</Nav.Link>
                    </Nav>
                    <Nav className='px-5'>
                        {error}
                        <Figure className='m-auto'>
                            <FontAwesomeIcon icon="fa-regular fa-user" style={{color: "#ffffff",}} />
                        </Figure>
                        <NavDropdown title={currentUser.email} id="collasible-nav-dropdown"
                        menuVariant='dark'
                        align={{ lg: 'end' }}>
                            <NavDropdown.Item disabled>Sign in as : { currentUser.email}</NavDropdown.Item>
                            <div className='d-flex justify-content-center p-3'>
                             <Button onClick={handleLogout} className='d-inline-block'>Log Out</Button>
                            </div>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Row>
        <Container className=''>
            <Form className='d-flex justify-content-center align-items-center' style={{minHeight:"150px"}} onSubmit={onSubmit}>
                <Form.Control
                ref={clearInput}
                className='w-50'
                placeholder='ex.Learn HTML'
                required
                onChange={(e)=>setReminder(e.target.value)}
                style={{borderRadius:"20px 0px 0px 20px", outline:"none", boxShadow:"none", border:'1px solid grey'}}
                />
                <Button type='submit' variant="outline-secondary" style={{borderRadius:"0px 20px 20px 0px", borderLeft:'none'}}>ADD</Button>
            </Form>
            
        </Container>
        <Container>
            <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                        {addReminder.map((val, key)=>{
                            return (
                            <>
                                <tr key={key}>
                                    <td>
                                        {val.reminder}
                                    </td>
                                    <td style={{width:'200px'}}>
                                        {val.date}
                                    </td>
                                    <td style={{width:'200px'}}>
                                        {val.time}
                                    </td>
                                    <td style={{width:"50px"}}>
                                        <span className='d-flex justify-content-center'>
                                            <input type='checkbox'
                                             checked={val.status}
                                             onChange={(e) => {
                                               updateReminderStatus(val.id, e.target.checked);
                                             }}
                                            className=''style={{cursor:"pointer"}}/>
                                        </span>
                                    </td>
                                    <td style={{width:"50px"}}>
                                        <span className='pointer d-flex justify-content-center'>
                                            <FontAwesomeIcon icon="fa-solid fa-trash"
                                            style={{cursor:"pointer"}}
                                            onClick={()=> deleteReminder
                                            (val.id)} /> 
                                        </span>
                                    </td>
                                </tr>
                            </>
                            )
                        })}            
                </tbody>
            </Table>
        </Container>
    </Container>
    </>
  )
}