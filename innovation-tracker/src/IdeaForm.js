import React, { useState } from 'react';
import axios from 'axios';

const IdeaForm = ({ onIdeaSubmitted }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Solar'); // Default category
    const [submitter, setSubmitter] = useState('');
    const [notification, setNotification] = useState(null); // State for notification

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/ideas', {
                title,
                description,
                category,
                submitter
            });
            console.log('Idea submitted:', response.data);
            onIdeaSubmitted(response.data); // Notify parent of new idea
            setNotification({ type: 'success', message: 'Idea has been successfully submitted!' });
            setTitle('');
            setDescription('');
            setCategory('Solar');
            setSubmitter('');
        } catch (error) {
            console.error('Error submitting idea:', error);
            setNotification({ type: 'error', message: 'There was an error submitting your idea. Please try again.' });
        }
    };

    return (
        <div>
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <h2>Submit new idea</h2>
            <form onSubmit={handleSubmit} className="idea-form">
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="Solar">Solar</option>
                        <option value="Wind">Wind</option>
                        <option value="Energy Storage">Energy Storage</option>
                        <option value="Power to X">Power to X</option>
                        <option value="IT">IT</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="submitter">Submitter</label>
                    <input
                        type="text"
                        id="submitter"
                        value={submitter}
                        onChange={(e) => setSubmitter(e.target.value)}
                        placeholder="Submitter"
                        required
                    />
                </div>

                <button type="submit">Submit Idea</button>
            </form>
        </div>
    );
};

export default IdeaForm;
