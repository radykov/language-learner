// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoryViewer from './components/StoryViewer';
import CreatorUI from './components/CreatorUI';
import Navigation from './components/Navigation';
import TestRunner from './components/TestRunner';
import './App.css';

const PUBLIC_URI = process.env.PUBLIC_URL;

// App.js
function App() {
  return (
    <Router basename={PUBLIC_URI}>
      <div className="app">
        <Navigation />
        <main>
          <Routes>
            <Route path="/creator" element={<CreatorUI />} />
            <Route path="/test" element={<TestRunner />} />
            <Route path="/" element={<StoryViewer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;