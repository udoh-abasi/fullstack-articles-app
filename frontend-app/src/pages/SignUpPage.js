import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signUp = async () => {
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
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

        <input
          type="password"
          value={confirmPassword}
          placeholder="Your password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="button" onClick={signUp}>
          Sign Up
        </button>
      </form>
    </>
  );
};

export default SignUpPage;
