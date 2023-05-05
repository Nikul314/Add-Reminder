import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login'
import PrivateRoute from './Components/PrivateRoute';
import  AuthProvider  from './Contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
    <Router>
      <Routes>
        <Route element={<PrivateRoute/>}>
          <Route exact path="/dashboard" element={ <Dashboard/> } />
        </Route>
        <Route path='/' element={ <App/> } />
        <Route path="/login" element={ <Login/> } />
      </Routes>
    </Router>
    </AuthProvider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
