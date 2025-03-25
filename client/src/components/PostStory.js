import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
 
const PostStory = ({ posts, result }) => {
    const { theme } = useSelector(state => state);
  

    if (result === 0) return <h2 className="text-center text-danger">No Post</h2>;

    return (
        <div className="post_story">
            {posts.map(post => (
                <div key={post._id} className="post_story_display">
                    <Link to={`/post/${post._id}`}>
                        {post.images[0].url.match(/video/i)
                            ? <video controls src={post.images[0].url} alt={post.images[0].url}
                                style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />
                            : <img src={post.images[0].url} alt={post.images[0].url}
                                style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />
                        }
                    </Link>
                  
                   
                </div>
            ))}
        </div>
    );
};

export default PostStory;