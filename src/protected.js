import { Navigate } from "react-router-dom";

function Protected({ cmp }) {
  return localStorage.getItem("login") === "true" ? <>{cmp}</> : <Navigate to="/login" replace />;
}

export default Protected;

