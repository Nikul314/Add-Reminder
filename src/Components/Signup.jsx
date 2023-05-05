import React, { useRef, useState }from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { auth } from '../firebase'  
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext'
import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'

export default function Signin(){
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const { signin } = useAuth()
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    if(passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    try {
      setError('')
      setLoading(true)
      // sign in the user
      await signin(auth, emailRef.current.value, passwordRef.current.value)

      // Create a user sigin data
      const userData = {
        email: emailRef.current.value
      }
      // Store the user data in firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
        setDoc(userDocRef, userData);
        
      // Navigate to the dashboard
      navigate("/dashboard")
    }catch (error){
      setError('Failed to create an account')
      console.log(error.message)
    }
    setLoading(false)
  }
  
  
  return (
    <>
        <Card>
          <Card.Body>
            <h2 className=' text-center mb-4'>Sign Up</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group id='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Form.Group id='password-confirm'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" ref={passwordConfirmRef} required />
              {error && <Alert variant='danger' className='mt-3 p-2'>{error}</Alert>}
              </Form.Group>
              <Button disabled={loading} className='w-100 mt-3' type='submit'>Sign Up</Button>
            </Form>
          </Card.Body>   
        </Card>
        <div className='w-100 text-center mt-2'>
          Already have an account? <Link to="/login">Log in</Link>
        </div>
    </>
  )
}
