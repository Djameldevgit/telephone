import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { imageShow, videoShow } from '../utils/mediaShow';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { FormCheck } from 'react-bootstrap';

import communesjson from "../json/communes.json"
import modelosjson from "../json/telefonos.json"

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';  // Importar los estilos predeterminados

import { crearPostPendiente, updatePost } from '../redux/actions/postAproveAction';

const StatusModal = () => {
    const { auth, theme, socket, status, } = useSelector((state) => state);


    const dispatch = useDispatch()

    const initilastate = {

        subCategory: "",



        marca: '',
        modelo: '',
        title2: "",

        title: "",
        description: "",
        price: "",
        unidaddeprecio: "",
        oferta: "",
        change: "",
        wilaya: "",
        commune: "",

        email: "",
        telefono: "",
        contadordevisitas: false,
        informacioncontacto: false,
        activarcomentarios: false,
        duraciondelanuncio: '',
        attributes: {
            referencia: '',
           
            marque: "",
            model: "",

            copie: '',
            memoire: '',
            color: '',
            os: '',
            appareil: '',
            camerafrontal: '',
            talleecran: '',
            ram: '',
            gigas: '',
            doublepuces: '',


        }
    }


    const [postData, setPostData] = useState(initilastate)
    const [images, setImages] = useState([])
    const [selectedWilaya, setSelectedWilaya] = useState("");

    const [selectedMarca, setSelectedMarca] = useState("");
    
    const [stream, setStream] = useState(false)
    const videoRef = useRef()
    const refCanvas = useRef()
    const [tracks, setTracks] = useState('')




    const handleWilayaChange = (event) => {
        const selectedWilaya = event.target.value;
        setSelectedWilaya(selectedWilaya);

        // Buscar la wilaya seleccionada
        const wilayaEncontrada = communesjson.find((wilaya) => wilaya.wilaya === selectedWilaya);
        const communes = wilayaEncontrada ? wilayaEncontrada.commune : [];

        // Establecer la primera comuna disponible o vacío


        // Actualizar postData con la wilaya seleccionada
        setPostData((prevState) => ({
            ...prevState,
            wilaya: selectedWilaya,
            commune: communes.length > 0 ? communes[0] : "", // Actualizar comuna si hay una disponible
        }));
    };
    const wilayasOptions = communesjson.map((wilaya, index) => (
        <option key={index} value={wilaya.wilaya}>
            {wilaya.wilaya}
        </option>
    ));
    const communesOptions = selectedWilaya
        ? communesjson
            .find((wilaya) => wilaya.wilaya === selectedWilaya)
            ?.commune?.map((commune, index) => (
                <option key={index} value={commune}>
                    {commune}
                </option>
            ))
        : [];
    const handleCommuneChange = (event) => {
        const selectedCommune = event.target.value;

        // Actualizar postData con la comuna seleccionada
        setPostData((prevState) => ({
            ...prevState,
            commune: selectedCommune,
        }));
    };

   
    const handleMarcaChange = (event) => {
        const selectedMarca = event.target.value;
        setSelectedMarca(selectedMarca);

        // Buscar la wilaya seleccionada
        const marcaEncontrada = modelosjson.find((marca) => marca.marca === selectedMarca);
        const modelos = marcaEncontrada ? marcaEncontrada.modelo : [];

        // Establecer la primera comuna disponible o vacío


        // Actualizar postData con la wilaya seleccionada
        setPostData((prevState) => ({
            ...prevState,
            marca: selectedMarca,
            modelo: modelos.length > 0 ? modelos[0] : "", // Actualizar comuna si hay una disponible
        }));
    };
    const marcasOptions = modelosjson.map((marca, index) => (
        <option key={index} value={marca.marca}>
            {marca.marca}
        </option>
    ));
    const modelosOptions = selectedMarca
        ? modelosjson
            .find((marca) => marca.marca === selectedMarca)
            ?.modelo?.map((modelo, index) => (
                <option key={index} value={modelo}>
                    {modelo}
                </option>
            ))
        : [];
    const handleModeloChange = (event) => {
        const selectedModelo = event.target.value;

        // Actualizar postData con la comuna seleccionada
        setPostData((prevState) => ({
            ...prevState,
            modelo: selectedModelo,
        }));
    };




    const handleChangeInput = (e) => {
        const { name, value, type, checked } = e.target;

        setPostData(prevState => {
            const isCheckbox = type === "checkbox";

            // Verificamos si el name pertenece a attributes
            const isAttribute = prevState.attributes && Object.prototype.hasOwnProperty.call(prevState.attributes, name);

            if (isAttribute) {
                // ✅ Si el campo pertenece a attributes, actualizamos dentro de attributes
                return {
                    ...prevState,
                    attributes: {
                        ...prevState.attributes,
                        [name]: isCheckbox ? checked : value
                    }
                };
            } else {
                // ✅ Si es un campo normal, lo actualizamos directamente
                return {
                    ...prevState,
                    [name]: isCheckbox ? checked : value
                };
            }
        });
    };





    const handleChangeImages = e => {
        const files = [...e.target.files]
        let err = ""
        let newImages = []

        files.forEach(file => {
            if (!file) return err = "File does not exist."

            if (file.size > 1024 * 1024 * 5) {
                return err = "The image/video largest is 5mb."
            }

            return newImages.push(file)
        })

        if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } })
        setImages([...images, ...newImages])
    }

    const deleteImages = (index) => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    const handleStream = () => {
        setStream(true)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(mediaStream => {
                    videoRef.current.srcObject = mediaStream
                    videoRef.current.play()

                    const track = mediaStream.getTracks()
                    setTracks(track[0])
                }).catch(err => console.log(err))
        }
    }

    const handleCapture = () => {
        const width = videoRef.current.clientWidth;
        const height = videoRef.current.clientHeight;

        refCanvas.current.setAttribute("width", width)
        refCanvas.current.setAttribute("height", height)

        const ctx = refCanvas.current.getContext('2d')
        ctx.drawImage(videoRef.current, 0, 0, width, height)
        let URL = refCanvas.current.toDataURL()
        setImages([...images, { camera: URL }])
    }

    const handleStopStream = () => {
        tracks.stop()
        setStream(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!postData.wilaya || !postData.commune) {
            return dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: "Por favor selecciona una wilaya y una comuna." },
            });
        }
        if (images.length === 0) {
            return dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: "Por favor agrega una foto o video." },
            });
        }

        if (status.onEdit) {
            dispatch(updatePost({ postData, images, auth, status }));
        } else {
            dispatch(crearPostPendiente({ postData, images, auth, socket }));
        }

        setPostData(initilastate);
        setImages([]);
        if (tracks) tracks.stop();
        dispatch({ type: GLOBALTYPES.STATUS, payload: false });
    };

    useEffect(() => {

        if (status?.onEdit) {
            setPostData({
                subCategory: status.subCategory || "",

                title: status.title || "",
                title2: status.title2 || "",
                marca: status.marca || "",
                modelo: status.modelo || "",
                description: status.description || "",
                price: status.price || "",
                unidaddeprecio: status.unidaddeprecio || "",
                oferta: status.oferta || "",
                change: status.change || "",
                wilaya: status.wilaya || "",
                commune: status.commune || "",
                email: status.email || "",
                telefono: status.telefono || "",
                contadordevisitas: status.contadordevisitas || false,
                informacioncontacto: status.informacioncontacto || false,
                activarcomentarios: status.activarcomentarios || false,
                duraciondelanuncio: status.duraciondelanuncio || "",
                attributes: {

                    marque: status.attributes?.marque || "",
                    model: status.attributes?.model || "",
                    copie: status.attributes?.copie || "",
                    memoire: status.attributes?.memoire || "",
                    color: status.attributes?.color || "",
                    os: status.attributes?.os || "",
                    appareil: status.attributes?.appareil || "",
                    camerafrontal: status.attributes?.camerafrontal || "",
                    talleecran: status.attributes?.talleecran || "",
                    ram: status.attributes?.ram || "",
                    gigas: status.attributes?.gigas || "",
                    doublepuces: status.attributes?.doublepuces || "",

                },
            });
            setImages(status.images || []);
            setSelectedWilaya(status.wilaya || "");
            setSelectedMarca(status.marca|| "");
            
        }
    }, [status]);
    const subcategory = () => (
        <div>
            <input
                type="hIdden"
                name="subCategory"

                value={postData.subCategory}
                className="form-control"
                onChange={handleChangeInput}
            />
        </div>
    )

    const itemssubcategory = () => (
        <div className="form-group">
            <select
                name="title"
                value={postData.title}
                onChange={handleChangeInput}
                className="form-control"
                required
            >  <option value="">Sélectionner une catégorie</option>
                <option value="Smartphones">Smartphones</option>
                <option value="Téléphones_cellulaires">Téléphones cellulaires</option>
                <option value="Tablettes">Tablettes</option>
                <option value="Fixes_fax">Téléphones fixes et fax</option>
                <option value="Smart_watchs">Montres connectées (Smartwatches)</option>
                <option value="Offres_et_Abonnements">Offres et Abonnements</option>
                <option value="Pièces_de_rechange">Pièces de rechange</option>
                <option value="Casques_et_écouteurs">Casques et écouteurs</option>
                <option value="Chargeur_et_câble">Chargeurs et câbles</option>
                <option value="Accessoires">Accessoires</option>
                <option value="Power_Banks">Batteries externes (Power Banks)</option>
                <option value="Baffle">Baffle</option>

                <option value="Enceintes_Bluetooth">Enceintes Bluetooth</option>
                <option value="Support_téléphone">Supports pour téléphone</option>
                <option value="Protection_écran">Protections d’écran</option>
                <option value="Coques">Coques et étuis</option>
                <option value="Claviers_et_souris">Claviers et souris sans fil</option>
                <option value="Station_de_chargement">Stations de charge</option>
                <option value="Cartes_mémoire">Cartes mémoire</option>
                <option value="Dongles_USB">Dongles et adaptateurs USB</option>
            </select>
            <small className="text-danger">Ce champ est requis</small>
        </div>
    )
    const title2 = () => (
        <div>
            <input
                type="text"
                name="title2"
                placeholder="Titre"
                value={postData.title2}
                className="form-control"
                onChange={handleChangeInput}
            />
        </div>
    )
    const referencia = () => (
        <div className="form-group">

            <input
                type="text"
                name="referencia"
                value={postData.attributes.referencia}
                onChange={handleChangeInput}
                className="form-control"
                placeholder='Référence'
            />
        </div>
    )

    const marca = () => (
        <div className="form-group">
            <label className="text-primary">Marque:</label>
            <select
                            multiple={false}
                            className="form-control"
                            name="marca"
                            value={postData.marca} // Usar postData.wilaya
                            onChange={handleMarcaChange}
                        >
                            <option value="">Sélectionnez une Marque</option>
                            {marcasOptions} {/* Opciones de wilayas */}
                        </select>
                        <small className="text-danger">Ce champ est requis</small>
            <small className='text-danger'>Ce champ est requis</small>
        </div>
    )
    const modelo = () => (
        <div className="form-group">
            <label className="text-primary">Modèle:</label>
            
                        <select
                            multiple={false}
                            className="form-control"
                            name="modelo"
                            value={postData.modelo} // Usar postData.modelo
                            onChange={handleModeloChange}
                        >
                            <option value="">Sélectionnez la modelo</option>
                            {modelosOptions} {/* Opciones de communes */}
                        </select>
                        <small className="text-danger">Ce champ est requis</small>
                    </div>
    )

    const marque = () => (
        <div>
            <input
                type="text"
                name="marque"
                placeholder="Marque"
                value={postData.attributes.marque}
                className="form-control"
                onChange={handleChangeInput}
            />
        </div>
    )
    const model = () => (
        <div>
            <input
                type="text"
                name="model"
                placeholder="Modèle"
                value={postData.attributes.model}
                className="form-control"
                onChange={handleChangeInput}
            />
        </div>
    )


    const copie = () => (
        <div className="form-group">
            <label className="text-primary">Copie:</label>
            <select
                multiple={false}
                name="copie"
                value={postData.copie}
                onChange={handleChangeInput}
                className="form-control"
            >
                <option value="Original">Original</option>
                <option value="Reconditionné">Reconditionné</option>
                <option value="Copie Chinois">Copie Chinois</option>
                <option value="Premium Copy">Premium Copy</option>
                <option value="Clone">Clone</option>
                <option value="Grade A+">Grade A+</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
                <option value="Grade C">Grade C</option>

            </select>
        </div>
    );

    const memoire = () => (
        <div className="form-group">
            <label className="text-primary">Mémoire:</label>
            <select
                multiple={false}
                name="memoire"
                value={postData.memoire}
                onChange={handleChangeInput}
                className="form-control"
            >
                <option value="1 TO">1 TO</option>
                <option value="512 GO">512 GO</option>
                <option value="256 GO">256 GO</option>
                <option value="128 GO">128 GO</option>
                <option value="64 GO">64 GO</option>
                <option value="32 GO">32 GO</option>
                <option value="16 GO">16 GO</option>
                <option value="8 GO">8 GO</option>
                <option value="4 GO">4 GO</option>
                <option value="2 GO">2 GO</option>
                <option value="1 GO">1 GO</option>
                <option value="512 MO">512 MO</option>
                <option value="256 MO">256 MO</option>
            </select>
        </div>
    );

    const color = () => (
        <div className="form-group">
            <label className="text-primary">Couleurs:</label>
            <select
                multiple={false}
                name="color"
                value={postData.color}
                onChange={handleChangeInput}
                className="form-control"
            >
                <option value="Blanc">Blanc</option>
                <option value="Noir">Noir</option>
                <option value="Doré">Doré</option>
                <option value="Argenté">Argenté</option>
                <option value="Bleu">Bleu</option>
                <option value="Bleu nuit">Bleu nuit</option>
                <option value="Rouge">Rouge</option>
                <option value="Bordeaux">Bordeaux</option>
                <option value="Vert">Vert</option>
                <option value="Vert forêt">Vert forêt</option>
                <option value="Rose">Rose</option>
                <option value="Rose gold">Rose gold</option>
                <option value="Gris">Gris</option>
                <option value="Gris sidéral">Gris sidéral</option>
                <option value="Jaune">Jaune</option>
                <option value="Orange">Orange</option>
                <option value="Violet">Violet</option>
                <option value="Lavande">Lavande</option>
                <option value="Bronze">Bronze</option>
                <option value="Titanium">Titanium</option>
                <option value="Autre">Autre</option>
            </select>
        </div>
    )

    const etat = () => (
        <div className="form-group">
            <label className="text-primary">État:</label>
            <select
                multiple={false}
                name="etat"
                value={postData.etat}
                onChange={handleChangeInput}
                className="form-control"
            >
                <option value="">État</option>
                <option value="Neuf jamais utilisé">Neuf jamais utilisé</option>
                <option value="État neuf">État neuf</option>
                <option value="Comme neuf">Comme neuf</option>
                <option value="Reconditionné à neuf">Reconditionné à neuf</option>
                <option value="Bon état">Bon état</option>
                <option value="État moyen">État moyen</option>
                <option value="Écran fissuré, fonctionne bien">Écran fissuré, fonctionne bien</option>
                <option value="Dysfonctionnement partiel">Dysfonctionnement partiel</option>
                <option value="Pour pièces détachées">Pour pièces détachées</option>
            </select>
        </div>
    );



    const os = () => (
        <div className="form-group">
            <label className='text-primary'>OS/Android:</label>
            <select
                multiple={false}
                name="os"
                value={postData.os}
                onChange={handleChangeInput}
                className="form-control"
            >
                <option value="IOS">IOS</option>
                <option value="IOS (version spécifique)">IOS (Indiquer la version)</option>
                <option value="Android">Android</option>
                <option value="Android (version spécifique)">Android (Indiquer la version)</option>
                <option value="Windows Phone">Windows Phone</option>
                <option value="BlackBerry OS">BlackBerry OS</option>
                <option value="KaiOS">KaiOS</option>
                <option value="HarmonyOS">HarmonyOS</option>
                <option value="Ubuntu Touch">Ubuntu Touch</option>
                <option value="Sailfish OS">Sailfish OS</option>
                <option value="Autre">Autre</option>
            </select>
        </div>

    )


    const appareil = () => (
        <div className="form-group">
            <label className='text-primary'  >Appareil photo:</label>
            <input
                type="number"
                name="appareil"
                value={postData.appareil}
                onChange={handleChangeInput}
                className="form-control"
                placeholder='En Mégapixel'

            />
        </div>

    )

    const camerafrontal = () => (
        <div className="form-group">
            <label className="text-primary">Caméra Frontale:</label>
            <input
                type="number"
                name="camerafrontal"
                value={postData.camerafrontal}
                onChange={handleChangeInput}
                className="form-control"
                placeholder='En Mégapixel'

            />
        </div>
    )
    const talleecran = () => (
        <div className="form-group">
            <label className="text-primary">Talle écran:</label>
            <input
                type="text"
                name="talleecran"
                value={postData.talleecran}
                onChange={handleChangeInput}
                className="form-control"
                placeholder='Talle écran'

            />
        </div>
    )
    const ram = () => (
        <div className="form-group">
            <label className="text-primary">RAM:</label>
            <select
                multiple={false}
                name="ram"
                value={postData.ram}
                onChange={handleChangeInput}
                className="form-control"
            >
                <option value="128 MO">128 MO</option>
                <option value="256 MO">256 MO</option>
                <option value="512 MO">512 MO</option>
                <option value="1 GO">1 GO</option>
                <option value="2 GO">2 GO</option>
                <option value="3 GO">3 GO</option>
                <option value="4 GO">4 GO</option>
                <option value="6 GO">6 GO</option>
                <option value="8 GO">8 GO</option>
                <option value="12 GO">12 GO</option>
                <option value="16 GO">16 GO</option>
                <option value="24 GO">24 GO</option>
                <option value="32 GO">32 GO</option>
                <option value="64 GO">64 GO</option>
                <option value="128 GO">128 GO</option>
                <option value="256 GO">256 GO</option>
                <option value="512 GO">512 GO</option>
            </select>
        </div>

    )
    const gigas = () => (
        <div className="form-group">
            <label className="text-primary">Connectivité:</label>
            <select
                multiple={false}
                name="gigas"
                value={postData.gigas}
                onChange={handleChangeInput}
                className="form-control"
            >
                <option value="Sans réseau">Sans réseau</option>
                <option value="Avec 2G">Avec 2G</option>
                <option value="Avec 3G">Avec 3G</option>
                <option value="Avec 4G">Avec 4G</option>
                <option value="Avec 5G">Avec 5G</option>
            </select>
        </div>
    );

    const doublepuces = () => (
        <div className="form-group">
            <label className="text-primary">Double Puce:</label>
            <select
                multiple={false}
                name="doublepuces"
                value={postData.doublepuces}
                onChange={handleChangeInput}
                className="form-control"
            >
                <option value="Avec une seule puce">Avec une seule puce</option>
                <option value="Avec double puce">Avec double puce</option>
                <option value="Avec triple puce">Avec triple puce</option>
                <option value="Avec eSIM + SIM physique">Avec eSIM + SIM physique</option>
            </select>
        </div>
    );



    return (
        <div className='status_modal'  >
            <form onSubmit={handleSubmit}>
                <div className="status_header">
                    <h5 className="ml-2">Annonces Téléphones & Accessories</h5>
                    <span onClick={() => dispatch({
                        type: GLOBALTYPES.STATUS, payload: false
                    })}>
                        &times;
                    </span>
                </div>
                <div className="status_body">
                    <div className="form-group"   >

                        {itemssubcategory()}
                    </div>





                    {postData.title === "Smartphones" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>

                                <div className="form-group">
                                    {referencia()}
                                </div>
                                <label className="text-danger">Déscription</label>
                                <div className="form-group"  >
                                    {marca()}
                                </div>
                                <div className="form-group" >
                                    {modelo()}
                                </div>
                            </div>

                            <div>
                                <div className="form-group"  >
                                    {copie()}
                                </div>
                                <div className="form-group">
                                    {memoire()}
                                </div>
                                <div className="form-group"  >
                                    {color()}
                                </div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>

                            <div>
                                <div className="form-group">
                                    <label className="text-danger">Spécifications</label>
                                    <div className="form-group">
                                        {os()}
                                    </div>
                                    <div className="form-group">
                                        {appareil()}
                                    </div>
                                    <div className="form-group">
                                        {camerafrontal()}
                                    </div>
                                    <div className="form-group">
                                        {talleecran()}
                                    </div>
                                    <div className="form-group">
                                        {ram()}
                                    </div>
                                    <div className="form-group">
                                        {gigas()}
                                    </div>
                                    <div className="form-group">
                                        {doublepuces()}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {postData.title === "Téléphones_cellulaires" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                                <label className="text-danger">Déscription</label>
                                <div className="form-group"  >
                                    {marca()}
                                </div>
                                <div className="form-group" >
                                    {modelo()}
                                </div>
                            </div>

                            <div>
                                <div className="form-group"  >
                                    {copie()}
                                </div>
                                <div className="form-group">
                                    {memoire()}
                                </div>
                                <div className="form-group"  >
                                    {color()}
                                </div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>

                            <div>
                                <div className="form-group">
                                    <label className="text-danger">Spécifications</label>
                                    <div className="form-group">
                                        {os()}
                                    </div>
                                    <div className="form-group">
                                        {appareil()}
                                    </div>
                                    <div className="form-group">
                                        {camerafrontal()}
                                    </div>
                                    <div className="form-group">
                                        {talleecran()}
                                    </div>
                                    <div className="form-group">
                                        {ram()}
                                    </div>
                                    <div className="form-group">
                                        {gigas()}
                                    </div>
                                    <div className="form-group">
                                        {doublepuces()}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                    {postData.title === "Tablettes" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                                <label className="text-danger">Déscription</label>
                                <div className="form-group"  >
                                    {marca()}
                                </div>
                                <div className="form-group" >
                                    {modelo()}
                                </div>
                            </div>

                            <div>
                                <div className="form-group"  >
                                    {copie()}
                                </div>
                                <div className="form-group">
                                    {memoire()}
                                </div>
                                <div className="form-group"  >
                                    {color()}
                                </div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>

                            <div>
                                <div className="form-group">
                                    <label className="text-danger">Spécifications</label>
                                    <div className="form-group">
                                        {os()}
                                    </div>
                                    <div className="form-group">
                                        {appareil()}
                                    </div>
                                    <div className="form-group">
                                        {camerafrontal()}
                                    </div>
                                    <div className="form-group">
                                        {talleecran()}
                                    </div>
                                    <div className="form-group">
                                        {ram()}
                                    </div>
                                    <div className="form-group">
                                        {gigas()}
                                    </div>
                                    <div className="form-group">
                                        {doublepuces()}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {postData.title === "Fixes_fax" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>

                                <div className="form-group">
                                    {referencia()}
                                </div>
                                <label className="text-danger">Déscription</label>
                                <div className="form-group"  >
                                    {marque()}
                                </div>
                                <div className="form-group" >
                                    {model()}
                                </div>
                            </div>

                            <div>
                                <div className="form-group"  >
                                    {copie()}
                                </div>
                                <div className="form-group">
                                    {memoire()}
                                </div>
                                <div className="form-group"  >
                                    {color()}
                                </div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>



                        </div>
                    )}
                    {postData.title === "Smart_watchs" && (
                        <div>
                            <div><div className="form-group">
                                {subcategory()}
                            </div>

                                <div className="form-group">
                                    {title2()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                                <label className="text-danger">Déscription</label>
                                <div className="form-group"  >
                                    {marque()}
                                </div>
                                <div className="form-group" >
                                    {model()}
                                </div>
                            </div>

                            <div>
                                <div className="form-group"  >
                                    {copie()}
                                </div>
                                <div className="form-group">
                                    {memoire()}
                                </div>
                                <div className="form-group"  >
                                    {color()}
                                </div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>

                            <div>
                                <div className="form-group">
                                    <label className="text-danger">Spécifications</label>
                                    <div className="form-group">
                                        {os()}
                                    </div>
                                    <div className="form-group">
                                        {appareil()}
                                    </div>
                                    <div className="form-group">
                                        {camerafrontal()}
                                    </div>
                                    <div className="form-group">
                                        {talleecran()}
                                    </div>
                                    <div className="form-group">
                                        {ram()}
                                    </div>
                                    <div className="form-group">
                                        {gigas()}
                                    </div>
                                    <div className="form-group">
                                        {doublepuces()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {postData.title === "Offres_et_Abonnements" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>

                                <div className="form-group">
                                    {title2()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>
                        </div>
                    )}
                    {postData.title === "Pièces_de_rechange" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>

                                <div className="form-group">
                                    {title2()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>
                        </div>
                    )}

                    {postData.title === "Casques_et_écouteurs" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>

                                <div className="form-group">
                                    {title2()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>
                        </div>
                    )}

                    {postData.title === "Chargeur_et_câble" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>

                                <div className="form-group">
                                    {title2()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>
                        </div>
                    )}

                    {postData.title === "Accessoires" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>

                                <div className="form-group">
                                    {title2()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                                <label className="text-danger">Déscription</label>
                                <div className="form-group"  >
                                    {marque()}
                                </div>
                                <div className="form-group" >
                                    {model()}
                                </div>
                            </div>

                            <div>
                                <div className="form-group"  >
                                    {copie()}
                                </div>
                                <div className="form-group">
                                    {memoire()}
                                </div>
                                <div className="form-group"  >
                                    {color()}
                                </div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>

                            <div>
                                <div className="form-group">
                                    <label className="text-danger">Spécifications</label>
                                    <div className="form-group">
                                        {os()}
                                    </div>
                                    <div className="form-group">
                                        {appareil()}
                                    </div>
                                    <div className="form-group">
                                        {camerafrontal()}
                                    </div>
                                    <div className="form-group">
                                        {talleecran()}
                                    </div>
                                    <div className="form-group">
                                        {ram()}
                                    </div>
                                    <div className="form-group">
                                        {gigas()}
                                    </div>
                                    <div className="form-group">
                                        {doublepuces()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {postData.title === "Power_Banks" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>

                                <div className="form-group">
                                    {title2()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                                <label className="text-danger">Déscription</label>
                                <div className="form-group"  >
                                    {marque()}
                                </div>
                                <div className="form-group" >
                                    {model()}
                                </div>
                            </div>

                            <div>
                                <div className="form-group"  >
                                    {copie()}
                                </div>
                                <div className="form-group">
                                    {memoire()}
                                </div>
                                <div className="form-group"  >
                                    {color()}
                                </div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>

                            <div>
                                <div className="form-group">
                                    <label className="text-danger">Spécifications</label>
                                    <div className="form-group">
                                        {os()}
                                    </div>
                                    <div className="form-group">
                                        {appareil()}
                                    </div>
                                    <div className="form-group">
                                        {camerafrontal()}
                                    </div>
                                    <div className="form-group">
                                        {talleecran()}
                                    </div>
                                    <div className="form-group">
                                        {ram()}
                                    </div>
                                    <div className="form-group">
                                        {gigas()}
                                    </div>
                                    <div className="form-group">
                                        {doublepuces()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {postData.title === "Baffle" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>
                            <div className="form-group">
                                {marque()}
                            </div>
                        </div>
                    )}

                    {postData.title === "Enceintes_Bluetooth" && (
                        <div>
                            <div>
                                <div>
                                    <div className="form-group">
                                        {subcategory()}
                                    </div>
                                    <div className="form-group">
                                        {referencia()}
                                    </div>
                                </div>
                                <div>
                                    <div className="form-group">
                                        {etat()}
                                    </div>
                                </div>
                                <div className="form-group">
                                    {marque()}
                                </div>
                            </div>
                        </div>
                    )}



                    {postData.title === "Protection_écran" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>
                            <div className="form-group">
                                {marque()}
                            </div>
                        </div>
                    )}

                    {postData.title === "Coques" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>
                            <div className="form-group">
                                {marque()}
                            </div>
                        </div>
                    )}

                    {postData.title === "Claviers_et_souris" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>
                            <div className="form-group">
                                {marque()}
                            </div>
                            <div className="form-group">
                                {model()}
                            </div>
                        </div>
                    )}

                    {postData.title === "Cartes_mémoire" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>
                            <div className="form-group">
                                {marque()}
                            </div>
                        </div>
                    )}

                    {postData.title === "Dongles_USB" && (
                        <div>
                            <div>
                                <div className="form-group">
                                    {subcategory()}
                                </div>
                                <div className="form-group">
                                    {referencia()}
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    {etat()}
                                </div>
                            </div>
                            <div className="form-group">
                                {marque()}
                            </div>
                        </div>
                    )}











                    <div className="form-group mt-4">
                        <textarea name="description" value={postData.description}
                            onChange={handleChangeInput}
                            placeholder='Description...'
                        />
                    </div>
                    <div className="card-body form-group mb-4">
                        <label className="text-primary">Prix en Dinars</label>
                        <div style={{ padding: '0 20px' }}>
                            <Slider
                                min={200}
                                max={2000000}
                                step={200}
                                value={postData.price || 0} // Si no hay precio, el slider empieza en 0
                                onChange={(value) => {
                                    setPostData(prevState => ({
                                        ...prevState,
                                        price: value // Solo actualizamos el valor de 'price'
                                    }));
                                }}
                                trackStyle={{ backgroundColor: '#44EB00', height: 10 }}
                                handleStyle={{
                                    borderColor: '#00AF72',
                                    height: 20,
                                    width: 20,
                                    marginLeft: -10,
                                    marginTop: -5,
                                    backgroundColor: '#007bff',
                                }}
                                railStyle={{ backgroundColor: '#ccc', height: 10 }}
                            />
                        </div>

                        <div style={{ marginTop: 10 }}>
                            {postData.price}
                        </div>
                    </div>

                    <div className="form-group">

                        <select
                            multiple={false}
                            name="unidaddeprecio"
                            value={postData.unidaddeprecio}
                            onChange={handleChangeInput}
                            className="form-control"
                        >
                            <option  >Unité de prix</option>
                            <option value="DA">DA</option>
                          
                        </select>
                    </div>

                    <div className="form-group">

                        <select
                            multiple={false}
                            name="oferta"
                            value={postData.oferta}
                            onChange={handleChangeInput}
                            className="form-control"
                        >
                            <option >Type D'offre</option>
                            <option value="Fixe">Fixe</option>
                            <option value="Négociable">Négociable</option>
                            <option value="Offert">Offert</option>

                        </select>
                    </div>

                    <div className="form-group">

                        <select
                            multiple={false}
                            name="change"
                            value={postData.change}
                            onChange={handleChangeInput}
                            className="form-control"
                        >
                            <option  >Change</option>

                            <option value="J'accepte l'échange">J'accepte l'échange</option>
                            <option value="Pas d'échanges">Pas d'échanges </option>

                        </select>
                    </div>

                    <div className="form-group">
                        <small className="text-primary">Adresse du bien obligatoire</small>
                        <select
                            multiple={false}
                            className="form-control"
                            name="wilaya"
                            value={postData.wilaya} // Usar postData.wilaya
                            onChange={handleWilayaChange}
                        >
                            <option value="">Sélectionnez une wilaya</option>
                            {wilayasOptions} {/* Opciones de wilayas */}
                        </select>
                        <small className="text-danger">Ce champ est requis</small>
                    </div>

                    {/* Campo Commune */}
                    <div className="form-group">
                        <select
                            multiple={false}
                            className="form-control"
                            name="commune"
                            value={postData.commune} // Usar postData.commune
                            onChange={handleCommuneChange}
                        >
                            <option value="">Sélectionnez la commune</option>
                            {communesOptions} {/* Opciones de communes */}
                        </select>
                        <small className="text-danger">Ce champ est requis</small>
                    </div>



                    <div className="form-group">

                        <input onChange={handleChangeInput} value={postData.telefono} name="telefono" type="number" className="form-control" placeholder='Téléphone' />

                    </div>


                    <div className="form-group">

                        <input onChange={handleChangeInput} value={postData.email} name="email" type="email" className="form-control" placeholder='Adresse mail ' />
                        <small className='text-danger'>Ce champ est requis</small>
                    </div>



                    <div>
                        <label className="text-primary">Options Générales</label>
                        <div className="form-group">
                            <FormCheck
                                type="checkbox"
                                checked={postData.contadordevisitas}
                                onChange={(e) => setPostData({ ...postData, contadordevisitas: e.target.checked })}
                                label="Afficher lo compteur des visites"
                            />
                        </div>
                        <div className="form-group">
                            <FormCheck
                                type="checkbox"
                                checked={postData.informacioncontacto}
                                onChange={(e) => setPostData({ ...postData, informacioncontacto: e.target.checked })}
                                label="Autoriser les informations de contact"
                            />
                        </div>

                        <div className="form-group">
                            <FormCheck
                                type="checkbox"
                                checked={postData.activarcomentarios}
                                onChange={(e) => setPostData({ ...postData, activarcomentarios: e.target.checked })}
                                label="Activer les commentaires"
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-primary">Durée de l' annonces</label>
                            <select
                                multiple={false}
                                onChange={handleChangeInput} value={postData.duraciondelanuncio} name="duraciondelanuncio" className="form-control" >

                                <option value="nepasdesactiver">Ne pas désactiver</option>
                                <option value="15 jour">15 Jours</option>
                                <option value="1 mois">1 Mois</option>
                                <option value="3 mois">3 Mois</option>
                                <option value="6 mois">6 Mois</option>

                            </select>
                        </div>


                    </div>


                    <div className="show_images">
                        {
                            images.map((img, index) => (
                                <div key={index} id="file_img">
                                    {
                                        img.camera ? imageShow(img.camera, theme)
                                            : img.url
                                                ? <>
                                                    {
                                                        img.url.match(/video/i)
                                                            ? videoShow(img.url, theme)
                                                            : imageShow(img.url, theme)
                                                    }
                                                </>
                                                : <>
                                                    {
                                                        img.type.match(/video/i)
                                                            ? videoShow(URL.createObjectURL(img), theme)
                                                            : imageShow(URL.createObjectURL(img), theme)
                                                    }
                                                </>
                                    }
                                    <span onClick={() => deleteImages(index)}>&times;</span>
                                </div>
                            ))
                        }
                    </div>

                    {
                        stream &&
                        <div className="stream position-relative">
                            <video autoPlay muted ref={videoRef} width="100%" height="100%"
                                style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />

                            <span onClick={handleStopStream}>&times;</span>
                            <canvas ref={refCanvas} style={{ display: 'none' }} />
                        </div>
                    }

                    <div className="input_images">
                        {
                            stream
                                ? <i className="fas fa-camera" onClick={handleCapture} />
                                : <>
                                    <i className="fas fa-camera" onClick={handleStream} />

                                    <div className="file_upload">
                                        <i className="fas fa-image" />
                                        <input type="file" name="file" id="file"
                                            multiple accept="image/*,video/*" onChange={handleChangeImages} />
                                    </div>
                                </>
                        }

                    </div>



                    <div className="status_footer">
                        <button className="btn btn-secondary w-100" type="submit">
                            Publie
                        </button>
                    </div>
                </div>
            </form >
        </div >
    )
}

export default StatusModal
