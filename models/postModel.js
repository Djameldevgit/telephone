const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  subCategory: {
    type: String,
    
  },
  title: {
    type: String,
    required: true
  },
  title2: {
    type: String,
     
  },
  marca: {
    type: String,

  },
   
  modelo: {
    type: String,

  },
/*
  marque: {
    type: String,

  },
  model: {
    type: String,

  },
  anne: {
    type: String,

  },
  finition: {
    type: String,

  },
  moteur: {
    type: String,
  },

  kilometrage: {
    type: String,
  },

  papiers: {
    type: String,
  },

  energie: {
    type: String,
  },

  boite: {
    type: String,
  },
  couleur: {
    type: String,
  },
  */
  description: {
    type: String,
  },

  price: {
    type: String,
  },

  unidaddeprecio: {
    type: String,
  },

  oferta: {
    type: String,
  },

  change: {
    type: String,

  },



  wilaya: {
    type: String,

  },
  commune: {
    type: String,

  },

   
  email: {
    type: String,

  },
  telefono: {
    type: String,

  },
  contadordevisitas: {
    type: Boolean,

  },
  informacioncontacto: {
    type: Boolean,

  },
  activarcomentarios: {
    type: Boolean,

  },
  duraciondelanuncio: {
    type: String,

  },

  attributes: {
    type: Object, // Cambiar Map por Object
    default: {}   // Establecer un valor predeterminado
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'pendiente',
  },

  images: {
    type: Array,
    required: true
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
  user: { type: mongoose.Types.ObjectId, ref: 'user' }
}, {
  timestamps: true
})

module.exports = mongoose.model('post', postSchema)