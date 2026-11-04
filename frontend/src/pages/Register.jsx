import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/authService";
import ThemeToggle from "../components/ThemeToggle";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import BrandMark from "../components/BrandMark";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    try {
      await auth.register({ fullName, email, password });
      navigate("/");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Inscription impossible.",
      );
    }
  }

  return (
    <main className="auth">
      <ThemeToggle className="auth-theme-toggle" />
      <Card className="auth-card">
        <Link className="auth-brand" to="/login">
          <BrandMark /> secwatch
        </Link>
        <div className="eyebrow">Créer un compte</div>
        <h1>Rejoindre SecWatch</h1>
        <p>Un compte employé sera créé automatiquement.</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <label>
            Nom complet
            <Input
              autoComplete="name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>
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
              autoComplete="new-password"
              minLength="8"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <Button className="submit-button" type="submit">
            Créer le compte <span>→</span>
          </Button>
        </form>
        <div className="muted">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </div>
      </Card>
    </main>
  );
}
