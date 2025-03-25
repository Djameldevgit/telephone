const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
const Users = require('../models/userModel')

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const postCtrl = {
    crearPostPendiente: async (req, res) => {
        try {
            const { postData, images } = req.body
            const { subCategory,title,title2, marca, modelo,  description, price, unidaddeprecio, oferta, change, wilaya, commune,
                 email, telefono, contadordevisitas, informacioncontacto, activarcomentarios, duraciondelanuncio, attributes } = postData || {};

            if (images.length === 0)
                return res.status(400).json({ msg: "Please add your photo." })

            const newPost = new Posts({
                subCategory,title,title2, marca, modelo,  description, price, unidaddeprecio, oferta, change, wilaya, commune,
                 email, telefono, contadordevisitas, informacioncontacto, activarcomentarios, duraciondelanuncio, attributes,
                images,
                user: req.user._id,
            })
            await newPost.save()

            res.json({
                msg: 'Created Post!',
                newPost: {
                    ...newPost._doc,
                    user: req.user
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    aprobarPostPendiente: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id);
            if (!post) return res.status(404).json({ msg: 'Publicación no encontrada' });

            post.estado = 'aprobado';
            await post.save();
            // Envia el _id del post aprobado en la respuesta
            res.json({ msg: 'Poste approuvé!', _id: post._id });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getPostsPendientes: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({ estado: "pendiente" }), req.query).paginating()

            const posts = await features.query.sort('-createdAt')
                .populate("user likes", "avatar username   followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getPosts : async (req, res) => {
        try {
            // Extraer los parámetros de filtro desde req.query
            const { title2, title, wilaya,commune,marca,modelo,  startDate, endDate, minPrice, maxPrice } = req.query;
    
            // Definir la consulta básica para los posts aprobados
            const query = { estado: "aprobado" };
    
            // Aplicar filtros si están presentes en la solicitud
            if (title2) {
                query.title2 = title2;
            }
            if (title) {
                query.title = { $regex: title, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
            }
            if (wilaya) {
                query.wilaya = wilaya;
            }
            if (commune) {
                query.commune = commune;
            }
            if (marca) {
                query.marca = marca;
            }
            if (modelo) {
                query.modelo = modelo;
            }


            if (startDate || endDate) {
                query.createdAt = {}; // Campo de fecha en tu modelo
                if (startDate) {
                    query.createdAt.$gte = new Date(startDate); // Fecha de inicio
                }
                if (endDate) {
                    query.createdAt.$lte = new Date(endDate); // Fecha de fin
                }
            }
            if (minPrice || maxPrice) {
                query.price = {}; // Campo de precio en tu modelo
                if (minPrice) {
                    query.price.$gte = Number(minPrice); // Precio mínimo
                }
                if (maxPrice) {
                    query.price.$lte = Number(maxPrice); // Precio máximo
                }
            }
    
            // Obtener los posts filtrados y paginados
            const features = new APIfeatures(Posts.find(query), req.query).paginating();
    
            const posts = await features.query.sort('-createdAt')
                .populate("user likes", "avatar username fullname followers") // Populate user y likes
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password" // Excluir la contraseña del usuario
                    }
                });
    
            // Obtener el total de posts que coinciden con la consulta (sin paginación)
            const totalPosts = await Posts.countDocuments(query);
    
            // Responder con los posts encontrados y la información de paginación
            res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            });
    
        } catch (err) {
            // Manejar errores
            return res.status(500).json({ msg: err.message });
        }
    },
    updatePost: async (req, res) => {
        try {
            const {      subCategory,title,title2, marca, modelo,  description, price, unidaddeprecio, oferta, change, wilaya, commune,
                email, telefono, contadordevisitas, informacioncontacto, activarcomentarios, duraciondelanuncio, attributes,
         images

            } = req.body

            const post = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                subCategory,title,title2, marca, modelo,  description, price, unidaddeprecio, oferta, change, wilaya, commune,
                email, telefono, contadordevisitas, informacioncontacto, activarcomentarios, duraciondelanuncio, attributes,
           images


            }).populate("user likes", "avatar username  ")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            res.json({
                msg: "Updated Post!",
                newPost: {
                    ...post._doc,
                    subCategory,title,title2, marca, modelo,  description, price, unidaddeprecio, oferta, change, wilaya, commune,
                    email, telefono, contadordevisitas, informacioncontacto, activarcomentarios, duraciondelanuncio, attributes,
           images
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    likePost: async (req, res) => {
        try {
            const post = await Posts.find({ _id: req.params.id, likes: req.user._id })
            if (post.length > 0) return res.status(400).json({ msg: "You liked this post." })

            const like = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                $push: { likes: req.user._id }
            }, { new: true })

            if (!like) return res.status(400).json({ msg: 'This post does not exist.' })

            res.json({ msg: 'Liked Post!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unLikePost: async (req, res) => {
        try {

            const like = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                $pull: { likes: req.user._id }
            }, { new: true })

            if (!like) return res.status(400).json({ msg: 'This post does not exist.' })

            res.json({ msg: 'UnLiked Post!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({ user: req.params.id }), req.query)
                .paginating()
            const posts = await features.query.sort("-createdAt")

            res.json({
                posts,
                result: posts.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getUserStoyPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({ user: req.params.id }), req.query)
                .paginating()
            const posts = await features.query.sort("-createdAt")

            res.json({
                posts,
                result: posts.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getPost: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id)
                .populate("user likes", "avatar username  followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            if (!post) return res.status(400).json({ msg: 'This post does not exist.' })

            res.json({
                post
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
   /* getStory: async (req, res) => {
        try {
            const story = await Posts.findById(req.params.id)
                .populate("user likes", "avatar username  followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            if (!post) return res.status(400).json({ msg: 'This post does not exist.' })

            res.json({
                post
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },*/
    getPostsDicover: async (req, res) => {
        try {

            const newArr = [...req.user.following, req.user._id]

            const num = req.query.num || 9

            const posts = await Posts.aggregate([
                { $match: { user: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
            ])

            return res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deletePost: async (req, res) => {
        try {
            const post = await Posts.findOneAndDelete({ _id: req.params.id, user: req.user._id })
            await Comments.deleteMany({ _id: { $in: post.comments } })

            res.json({
                msg: 'Deleted Post!',
                newPost: {
                    ...post,
                    user: req.user
                }
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    savePost: async (req, res) => {
        try {
            const user = await Users.find({ _id: req.user._id, saved: req.params.id })
            if (user.length > 0) return res.status(400).json({ msg: "You saved this post." })

            const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
                $push: { saved: req.params.id }
            }, { new: true })

            if (!save) return res.status(400).json({ msg: 'This user does not exist.' })

            res.json({ msg: 'Saved Post!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unSavePost: async (req, res) => {
        try {
            const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
                $pull: { saved: req.params.id }
            }, { new: true })

            if (!save) return res.status(400).json({ msg: 'This user does not exist.' })

            res.json({ msg: 'unSaved Post!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getSavePosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({
                _id: { $in: req.user.saved }
            }), req.query).paginating()

            const savePosts = await features.query.sort("-createdAt")

            res.json({
                savePosts,
                result: savePosts.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = postCtrl