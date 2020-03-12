import React from 'react';
import './App.css';
import Main from './components/main';
import {BrowserRouter} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div>
      {/* App Component Has a Child Component called Main*/}
      <Main/>
    </div>
  </BrowserRouter>
  );
}

export default App;
