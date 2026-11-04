import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/authService";
import ThemeToggle from "../components/ThemeToggle";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import BrandMark from "../components/BrandMark";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    try {
      await auth.login({ email, password });
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Connexion impossible.");
    }
  }

  return (
    <main className="auth">
      <ThemeToggle className="auth-theme-toggle" />
      <Card className="auth-card">
        <Link className="auth-brand" to="/login">
          <BrandMark /> secwatch
        </Link>
        <div className="eyebrow">Espace sécurisé</div>
        <h1>Connexion</h1>
        <p>Accédez au suivi de vos incidents.</p>
        {sessionStorage.getItem("session-expired") && (
          <div className="notice">
            Votre session a expiré. Connectez-vous à nouveau.
            <button
              onClick={() => sessionStorage.removeItem("session-expired")}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        )}
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <label>
            Adresse email
            <Input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Mot de passe
            <Input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <Button className="submit-button" type="submit">
            Se connecter <span>→</span>
          </Button>
        </form>
        <div className="muted">
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </div>
      </Card>
    </main>
  );
}
