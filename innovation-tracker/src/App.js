// src/App.js
import React, { useState} from 'react';
import IdeaForm from './IdeaForm';
import IdeaList from './IdeaList';
import './App.css';

const App = () => {
    const [newIdea, setNewIdea] = useState(null);

    const handleIdeaSubmitted = (idea) => {
        setNewIdea(idea); // Update the new idea state
    };

    return (
        <div className="app-container">
            <header>
                <h1>Innovation Tracker</h1>
            </header>
            <div className="content">
                <div className="forms-section">
                    <IdeaForm  onIdeaSubmitted={handleIdeaSubmitted}/>
                </div>
                <div className="ideas-section">
                    <IdeaList newIdea={newIdea}/>
                </div>
            </div>
        </div>
    );
};

export default App;
