import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './Components/SignUpComponent';
import SignIn from './Components/SignInComponent';
import CreateTask from './Components/CreateTask';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Home from './Components/HomePage';
import GetErrands from './Components/GetTasks';
import MyLocationMap from './Components/Location';
import ContactUs from './Components/ContactUs';
import Navbar from "./Components/Navbar"



function App() {
  return (
    <Router>
    <div className="App">
    <Navbar /> 
    <Routes>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/signin' element={<SignIn/>}/>
      <Route path='/createtask' element={<CreateTask/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/dash' element={<GetErrands/>}/>
      <Route path='/loc' element={<MyLocationMap/>}/>
      <Route path='/contactus' element={<ContactUs/>}/>
    </Routes>
      
    </div>
    {/* <UpdateLocation user_id="1"/> */}
    </Router>
  );
}

export default App;
