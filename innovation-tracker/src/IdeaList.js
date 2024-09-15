import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IdeaList = ({ newIdea }) => {
    const [ideas, setIdeas] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');  // New state for author
    const [selectedIdeaId, setSelectedIdeaId] = useState(null);
    const [expandedIdeaId, setExpandedIdeaId] = useState(null);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/ideas');
                const sortedIdeas = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                const ideasWithComments = await Promise.all(sortedIdeas.map(async (idea) => {
                    try {
                        const commentsResponse = await axios.get(`http://localhost:8000/ideas/${idea.id}/comments`);
                        return { ...idea, comments: commentsResponse.data };
                    } catch (commentsError) {
                        console.error(`Error fetching comments for idea ${idea.id}:`, commentsError);
                        return { ...idea, comments: [] };
                    }
                }));

                setIdeas(ideasWithComments);
            } catch (error) {
                console.error('Error fetching ideas:', error);
            }
        };

        fetchIdeas();
    }, [newIdea]);

    const handleStatusChange = async (ideaId, newStatus) => {
        try {
            await axios.put(`http://localhost:8000/ideas/${ideaId}`, { status: newStatus });
            setIdeas(prevIdeas => prevIdeas.map(idea =>
                idea.id === ideaId ? { ...idea, status: newStatus } : idea
            ));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleCommentSubmit = async (ideaId) => {
        if (!commentAuthor.trim()) {
            alert("Author name cannot be empty.");
            return;
        }

        try {
            await axios.post(`http://localhost:8000/ideas/${ideaId}/comments`, {
                content: commentText,
                author: commentAuthor,  // Send the author along with the comment
            });

            setCommentText('');
            setCommentAuthor('');  // Clear the author input after submitting
            setSelectedIdeaId(null);

            const response = await axios.get('http://localhost:8000/ideas');
            const sortedIdeas = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            const ideasWithComments = await Promise.all(sortedIdeas.map(async (idea) => {
                try {
                    const commentsResponse = await axios.get(`http://localhost:8000/ideas/${idea.id}/comments`);
                    return { ...idea, comments: commentsResponse.data };
                } catch (commentsError) {
                    console.error(`Error fetching comments for idea ${idea.id}:`, commentsError);
                    return { ...idea, comments: [] };
                }
            }));

            setIdeas(ideasWithComments);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleCancelComment = () => {
        setCommentText('');
        setCommentAuthor('');
        setSelectedIdeaId(null);  // Close the comment form
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New':
                return '#ADD8E6';
            case 'Under review':
                return '#FFD700';
            case 'In progress':
                return '#FFA500';
            case 'Done':
                return '#32CD32';
            default:
                return '#ccc';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'solar':
                return '#FFDDC1';
            case 'wind':
                return '#C2E2F7';
            case 'energy storage':
                return '#D1F7D6';
            default:
                return '#F3F4F6';
        }
    };

    const toggleComments = (ideaId) => {
        setExpandedIdeaId(expandedIdeaId === ideaId ? null : ideaId);
    };

    return (
        <div className="idea-list">
            <h2>Innovation Ideas</h2>

            <div className="scrollable-idea-list">
                {ideas.length === 0 ? (
                    <p>No ideas to display.</p>
                ) : (
                    <ul>
                        {ideas.map((idea) => (
                            <li key={idea.id} className="idea-item">
                                <div className="idea-content">
                                    <strong className="idea-title">{idea.title}</strong>
                                    <p className="idea-description">{idea.description}</p>

                                    <div className="footer-container">
                                        <div className="category-box" style={{ backgroundColor: getCategoryColor(idea.category) }}>
                                            {idea.category}
                                        </div>
                                        <div className="idea-footer">
                                            <em>Submitted by:</em> {idea.submitter} on {new Date(idea.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <select
                                    value={idea.status}
                                    onChange={(e) => handleStatusChange(idea.id, e.target.value)}
                                    className="status-dropdown"
                                    style={{ backgroundColor: getStatusColor(idea.status) }}
                                >
                                    <option value="New">New</option>
                                    <option value="Under review">Under review</option>
                                    <option value="In progress">In progress</option>
                                    <option value="Done">Done</option>
                                </select>

                                <div className="comments-toggle" onClick={() => toggleComments(idea.id)}>
                                    {expandedIdeaId === idea.id ? '▲ Hide Comments' : '▼ Show Comments'}
                                </div>

                                {expandedIdeaId === idea.id && (
                                    <div className="comments-section">
                                        {idea.comments && idea.comments.length > 0 ? (
                                            <ul>
                                                {idea.comments.map((comment) => (
                                                    <li key={comment.id} className="comment-item">
                                                        <div className="comment-content">
                                                            <p>{comment.content}</p>
                                                            <div className="comment-footer">
                                                                <em>{comment.author} on {new Date(comment.created_at).toLocaleDateString()}</em>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No comments yet.</p>
                                        )}
                                        {selectedIdeaId === idea.id && (
                                            <div className="comment-form">
                                                <input
                                                    type="text"
                                                    value={commentAuthor}
                                                    onChange={(e) => setCommentAuthor(e.target.value)}
                                                    placeholder="Author"
                                                />
                                                <textarea
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    placeholder="Write your comment here"
                                                />
                                                <div className="button-group">
                                                    <button 
                                                        onClick={() => handleCommentSubmit(idea.id)}
                                                        style={{ marginRight: '10px' }} // Adding space between buttons
                                                    >
                                                        Submit Comment
                                                    </button>
                                                    <button 
                                                        onClick={handleCancelComment}
                                                        style={{ backgroundColor: 'red', color: 'white' }} // Styling for the red Cancel button
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {selectedIdeaId !== idea.id && (
                                            <button onClick={() => setSelectedIdeaId(idea.id)}>Add Comment</button>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default IdeaList;
