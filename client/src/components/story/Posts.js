import React, { useState, useEffect } from 'react'
 
import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../LoadMoreBtn'
import { getDataAPI } from '../../utils/fetchData'
import { STORY_TYPES } from '../../redux/actions/storyAction'
import PostStory from '../PostStory'

const Posts = ({auth, id, dispatch, story}) => {
    const [posts, setPosts] = useState([])
    const [result, setResult] = useState(9)
    const [page, setPage] = useState(0)
    const [load, setLoad] = useState(false)

    useEffect(() => {
        story.posts.forEach(data => {
            if(data._id === id){
                setPosts(data.posts)
                setResult(data.result)
                setPage(data.page)
            }
        })
    },[story.posts, id])

    const handleLoadMore = async () => {
        setLoad(true)
        const res = await getDataAPI(`user_story_posts/${id}?limit=${page * 9}`, auth.token)
        const newData = {...res.data, page: page + 1, _id: id}
        dispatch({type: STORY_TYPES.UPDATE_POST, payload: newData})
        setLoad(false)
    }

    return (
        <div>
            <PostStory posts={posts} result={result} />

            {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            }

            
            <LoadMoreBtn result={result} page={page}
            load={load} handleLoadMore={handleLoadMore} />
            
        </div>
    )
}

export default Posts
