import React, { useRef, useState }from 'react'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { auth } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext'
import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'


export default function Signin(){
  const emailRef = useRef()
  const passwordRef = useRef()
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const { login } = useAuth()
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await login(auth, emailRef.current.value, passwordRef.current.value)
      const userData = {
        email: emailRef.current.value
      }
      // Store the user data in firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
        setDoc(userDocRef, userData);
      navigate("/dashboard")
    }catch (error){
        setError('Failed to login')
        console.log(error.message)
    }
    setLoading(false)
  }
  
  
  return (
    <>
    <Container className="d-flex align-items-center justify-content-center" style={{minHeight:"100vh", display:"none"}}>
        <div className="w-100" style={
          {maxWidth:"400px"}}>
            <Card>
              <Card.Body>
                <h2 className=' text-center mb-4'>Log In</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group id='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} />
                  </Form.Group>
                  <Form.Group id='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef}  />
                  </Form.Group>
                  {error && <Alert variant='danger' className='mt-3 p-2'>{error}</Alert>}
                  <Button disabled={loading} className='w-100 mt-3' type='submit'>Log In</Button>
                </Form>
              </Card.Body>   
            </Card>
            <div className='w-100 text-center mt-2'>
                Create an account? <Link to="/">Sign up</Link>
            </div>
        </div>
      </Container>
    </>
  )
}
