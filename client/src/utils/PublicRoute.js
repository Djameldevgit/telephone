import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const { auth } = useSelector(state => state);

  return (
    <Route
      {...rest}
      render={props =>
        auth.token && restricted ? <Redirect to={`/profile/${auth.user._id}`} /> : <Component {...props} />
      }
    />
  );
};

export default PublicRoute;
