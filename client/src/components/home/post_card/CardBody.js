import React, { useState } from 'react'
import Carousel from '../../Carousel'

const CardBody = ({post, theme}) => {
    const [readMore, setReadMore] = useState(false)

    
    return (
        <div className="card_body">
   
            {
                post.images.length > 0 && <Carousel images={post.images} id={post._id} />
            }
        </div>
    )
}

export default CardBody
