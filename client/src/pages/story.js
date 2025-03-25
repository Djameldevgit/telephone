import React, { useEffect, useState } from 'react'


import Posts from '../components/story/Posts'
import Saved from '../components/story/Saved'

import { useSelector, useDispatch } from 'react-redux'
import LoadIcon from '../images/loading.gif'

import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getStoryUsers } from '../redux/actions/storyAction'

import InfoStory from '../components/story/InfoStory'

const Story = () => {
    const { story, auth, languageReducer } = useSelector(state => state)
    const dispatch = useDispatch()

    const { t } = useTranslation()
    const { id } = useParams()
    const [saveTab, setSaveTab] = useState(false)

    useEffect(() => {
        if (story.ids.every(item => item !== id)) {
            dispatch(getStoryUsers({ id, auth }))
        }
    }, [id, auth, dispatch, story.ids])

    return (
        <div className="profile">

            <InfoStory auth={auth} story={story} dispatch={dispatch} id={id} />

            {
                auth.user._id === id &&
                <div className="profile_tab">
                    <button className='btn btn-info' >mes publicaciones</button>
                </div>
            }

            {
                story.loading
                    ? <img className="d-block mx-auto" src={LoadIcon} alt="loading" />
                    : <>


                        : <Posts auth={auth} story={story} dispatch={dispatch} id={id} />

                    </>
            }

        </div>
    )
}

export default Story
