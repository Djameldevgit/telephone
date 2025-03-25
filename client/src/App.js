import { useEffect, useState } from 'react'
import { BrowserRouter as Router,  Route, Redirect } from 'react-router-dom';
import PageRender from './customRouter/PageRender'
import PrivateRouter from './customRouter/PrivateRouter'

 
import Register from './pages/register'

import Alert from './components/alert/Alert'
import Header from './components/header/Header'
import StatusModal from './components/StatusModal'

import { useSelector, useDispatch } from 'react-redux'
import { refreshToken } from './redux/actions/authAction'
import { getPosts } from './redux/actions/postAction'
import { getSuggestions } from './redux/actions/suggestionsAction'

import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import SocketClient from './SocketClient'

import { getNotifies } from './redux/actions/notifyAction'
import CallModal from './components/message/CallModal'

import { getUsers } from './redux/actions/userAction'
 
import Listadeusuariosbloqueadoss from './pages/administration/users/listadeusuariosbloqueadoss'
import { getBlockedUsers } from './redux/actions/userBlockAction'
import Paginabloqueos from './pages/paginabloqueos'
import Roles from './pages/administration/users/roles'
import Homepostspendientes from './pages/administration/homepostspendientes'
import { getPostsPendientes } from './redux/actions/postAproveAction'
 
import Post from './pages/post'
import Edicionusers from './pages/administration/users/edicionusers'
 
import Home from './pages/home'
import Reportuser from './pages/administration/users/reportuser';
import Bloqueos from './pages/bloqueos'
import { useHistory } from 'react-router-dom';

 
import UsersAction from './components/adminitration/UsersAction';
import Informacionaplicacion from './pages/informacionaplicacion';
import Profile from './pages/profile';
import Login from './pages/login';
import Peer from 'peerjs'
import Story from './pages/story';
import Contact from './pages/contact';


function App() {
  const { auth, status, modal, call, languageReducer, userBlockReducer } = useSelector(state => state); //, userBlockReducer }

  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory()

  const language = languageReducer?.language || localStorage.getItem("lang") || "en";

  useEffect(() => {
    // Verificar si existe
    if (language === "ar") {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
  }, [language]); // Ahora depende de `language`, que siempre tiene un valor

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: '/', secure: true
    })
    
    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer })
  },[dispatch])

  useEffect(() => {
    if (auth.token && !isLoggedIn) {
      setIsLoggedIn(true); // Marcar que el usuario acaba de iniciar sesión
    }
  }, [auth.token, isLoggedIn]); // Agrega isLoggedIn como dependencia
  // Verificamos si el usuario está bloqueado
  const blockedUser = userBlockReducer.blockedUsers.find(blockedUser => blockedUser.user._id === auth.user?._id);
  useEffect(() => {

    if (blockedUser) {
      // Si el usuario está bloqueado, redirigir a la página de bloqueos
      <Redirect to={'/bloqueos'} />
    }

  }, [blockedUser, history]);



  useEffect(() => {
    dispatch(refreshToken());
    const socket = io();
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });
    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getSuggestions(auth.token));
      dispatch(getNotifies(auth.token));
      dispatch(getUsers(auth.token));
      dispatch(getBlockedUsers(auth.token));
      dispatch(getPostsPendientes(auth.token));
    }
  }, [dispatch, auth.token]);

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") { } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") { }
      });
    }
  }, []);

  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className="main">


          {!blockedUser ? <Header />
            : null
          }


          {status && <StatusModal />}
          {auth.token && <SocketClient />}
          {call && <CallModal />}

          <Route exact path="/ontact" component={ Contact } />

          <Route exact path="/informacionaplicacion" component={ Informacionaplicacion  } />
          <Route exact path="/administration/usersaction" component={auth.token ? UsersAction : Login} />
          <Route exact path="/administration/usersedicion" component={auth.token ? Edicionusers : Login} />
          <Route exact path="/administration/listadeusuariosbloqueadoss" component={auth.token ? Listadeusuariosbloqueadoss : Login}/>
          <Route exact path="/administration/paginabloqueos" component={auth.token ? Paginabloqueos: Login}/>
          <Route exact path="/administration/homepostspendientes" component={auth.token ? Homepostspendientes : Login} />
          <Route exact path="/administration/roles" component={auth.token ? Roles : Login} />
          <Route exact path="/administration/users/reportuser" component={auth.token ? Reportuser : Login}/>
          <Route exact path="/profile/:id" component={auth.token ? Profile : Login}/>
          <Route exact path="/story/:id" component={auth.token ? Story : Login}/>
          <Route exact path="/login" component={Login} />
          <Route exact path="/bloqueos" component={Bloqueos} />
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/post/:id" component={Post} />

          <PrivateRouter exact path="/:page" component={PageRender} />
          <PrivateRouter exact path="/:page/:id" component={PageRender} />

        </div>
      </div>
    </Router>
  );
}

export default App;
