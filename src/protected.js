import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Protected(props) {
  const { cmp } = props;
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication logic here
    const login = localStorage.getItem("login"); // Implement your authentication logic
    if (!login) {
      // Redirect to login page if not authenticated
      navigate("/login");
    }
  }, [navigate]);

  return <>{cmp}</>;
}
export default Protected;
