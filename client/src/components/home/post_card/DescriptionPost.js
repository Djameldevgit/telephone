
import Description from './Description';

const DescriptionPost = ({ post, readMore, setReadMore }) => {

    return (
        <div className="description-container">
            <div className="post-info">
                <div className="info-item">
                    <i className="fas fa-car"></i>
                    <span className="info-label mr-2">{post.subCategory}</span>
                    <span className="info-label mr-2">{post.title}</span>
                    <span className="info-value mr-2">{post.marca}</span>
                    <span className="info-value">{post.modelo}</span>
                </div>

                <div className="info-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span className="info-label">Publié le:</span>
                    <span className="info-value">{new Date(post.createdAt).toLocaleDateString()} à {new Date(post.createdAt).toLocaleTimeString()}</span>
                </div>

                <div className="info-item">
                    <i className="fas fa-sync-alt"></i>
                    <span className="info-label">Actualisé le:</span>
                    <span className="info-value">{new Date(post.updatedAt).toLocaleDateString()} à {new Date(post.updatedAt).toLocaleTimeString()}</span>
                </div>

                {(post.vistas || []).length > 0 && (
                    <div className="info-item">
                        <i className="fas fa-eye"></i>
                        <span className="info-label">Vue:</span>
                        <span className="info-value">{post.vistas}</span>
                    </div>
                )}

                {post.attributes.anne && (
                    <div className="info-item">
                        <i className="fas fa-calendar"></i>
                        <span className="info-label">Année:</span>
                        <span className="info-value">{post.attributes.anne}</span>
                    </div>
                )}
                {post.attributes.referencia && (
                    <div className="info-item">
                        <i className="fas fa-road"></i>
                        <span className="info-label">Kilométrage:</span>
                        <span className="info-value">{post.attributes.referencia} Km</span>
                    </div>
                )}
                {post.attributes.copie && (
                    <div className="info-item">
                        <i className="fas fa-cogs"></i>
                        <span className="info-label">copie:</span>
                        <span className="info-value">{post.attributes.copie}</span>
                    </div>
                )}
                {post.attributes.memoire && (
                    <div className="info-item">
                        <i className="fas fa-gas-pump"></i>
                        <span className="info-label">memoire:</span>
                        <span className="info-value">{post.attributes.memoire}</span>
                    </div>
                )}
                {post.attributes.color && (
                    <div className="info-item">
                        <i className="fas fa-tachometer-alt"></i>
                        <span className="info-label">Couleur:</span>
                        <span className="info-value">{post.attributes.color}</span>
                    </div>
                )}
                {post.attributes.os && (
                    <div className="info-item">
                        <i className="fas fa-palette"></i>
                        <span className="info-label">os:</span>
                        <span className="info-value">{post.attributes.os}</span>
                    </div>
                )}
                {post.attributes.appareil && (
                    <div className="info-item">
                        <i className="fas fa-palette"></i>
                        <span className="info-label">appareil:</span>
                        <span className="info-value">{post.attributes.appareil}</span>
                    </div>
                )}
           {post.attributes.camerafrontal && (
                    <div className="info-item">
                        <i className="fas fa-palette"></i>
                        <span className="info-label">camerafrontal:</span>
                        <span className="info-value">{post.attributes.camerafrontal}</span>
                    </div>
                )}
  {post.attributes.talleecran && (
                    <div className="info-item">
                        <i className="fas fa-palette"></i>
                        <span className="info-label">talleecran:</span>
                        <span className="info-value">{post.attributes.talleecran}</span>
                    </div>
                )}

{post.attributes.ram && (
                    <div className="info-item">
                        <i className="fas fa-palette"></i>
                        <span className="info-label">ram:</span>
                        <span className="info-value">{post.attributes.ram}</span>
                    </div>
                )}

{post.attributes.gigas && (
                    <div className="info-item">
                        <i className="fas fa-palette"></i>
                        <span className="info-label">gigas:</span>
                        <span className="info-value">{post.attributes.gigas}</span>
                    </div>
                )}
  {post.attributes.doublepuces && (
                    <div className="info-item">
                        <i className="fas fa-palette"></i>
                        <span className="info-label">doublepuces:</span>
                        <span className="info-value">{post.attributes.doublepuces}</span>
                    </div>
                )}










                <Description post={post} readMore={readMore} setReadMore={setReadMore} />




                
            </div>
        </div>
    );
};

export default DescriptionPost;
