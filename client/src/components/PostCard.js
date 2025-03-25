import React from 'react'
import CardHeader from './home/post_card/CardHeader'
import CardBodyCarousel from './home/post_card/CardBodyCarousel'


import Comments from './home/Comments'
import InputComment from './home/InputComment'
import CardBodyTitle from './home/post_card/CardBodyTitle'

import { useLocation } from "react-router-dom";
import DescriptionPost from './home/post_card/DescriptionPost'
import InformationUserPost from './home/post_card/InformationUserPost'
import { useSelector } from 'react-redux';
import DescriptionUserPost from './home/post_card/DescriptionUserPost'
import CommentDate from './home/post_card/CommentDate'

const PostCard = ({ post, theme }) => {
    const location = useLocation();
    const isPostDetailPage = location.pathname === `/post/${post._id}`;
    const { auth } = useSelector(state => state); // 🔹 Obtiene la autenticación desde Redux

    const isAuthenticated = auth.token ? true : false; // 🔹 Verifica si el usuario está autenticado

    return (
        <div className="card my-3">



            <CardHeader post={post} />
            <CardBodyTitle post={post} />
            <CardBodyCarousel post={post} theme={theme} />

<CommentDate post={post} theme={theme}/>



            {isPostDetailPage && <DescriptionPost post={post} />}

            {isPostDetailPage && <DescriptionUserPost post={post} />}
            {isAuthenticated && isPostDetailPage && (
                <>


                    <InformationUserPost post={post} />
                    {isPostDetailPage && <Comments post={post} />}
                    {isPostDetailPage && <InputComment post={post} />}
                </>
            )}

        </div>
    );
};

export default PostCard;
