import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      navigate("/articles");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h1>Log In </h1>
      <form>
        {error && <p className="error">{error}</p>}
        <input
          value={email}
          placeholder="Your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          value={password}
          placeholder="Your password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" onClick={login}>
          Log In
        </button>
        <p style={{ display: "block" }}>
          Don't have an account? <Link to="/signup">Sign Up here.</Link> It will
          only take a second
        </p>
      </form>
    </>
  );
};

export default LoginPage;
