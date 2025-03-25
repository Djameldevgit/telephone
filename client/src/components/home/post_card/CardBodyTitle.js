import React from "react";
import { useLocation } from "react-router-dom";

const CardBodyTitle = ({ post }) => {
    const location = useLocation();
    const isDetailPage = location.pathname === `/post/${post._id}`;

    return (
        <div className="cardtitle">
            <div className="card-header">
                {!isDetailPage && (
                    <div>
                        <div className="title-post">
                             
                           
                            {(post.title === "Smartphones" || post.title === "Téléphones_cellulaires"|| post.title === "Tablettes") ? (
                                 <>
                                 <div className="title0">{post.title}</div>

                                 <div className="title0">{post.marca}</div>
                                 <div className="title0">{post.modelo}</div>
                             </>
                            ) : (
                                <>
                                <div className="title0">{post.title}</div>
                                    <div className="title2">{post.attributes.title2}</div>
                                    <div className="title3"> {post.attributes.marque}</div>
                                    <div className="title3">{post.attributes.model}</div>

                                </>
                            )}
                        </div>

                    </div>
                )}


            </div>

            {!isDetailPage && (

                <div className="titlelocation">

 
                    <div ><span className="ml-1 mr-1 text-danger">{post.price}</span> <span>{post.unidaddeprecio}</span> <span> </span></div>
                </div>
            )}

        </div>
    );
};

export default CardBodyTitle;




