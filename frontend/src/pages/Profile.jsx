import { useEffect, useState } from "react";
import { api } from "../services/api";
import { auth } from "../services/authService";
export default function Profile() {
  const [f, F] = useState({ fullName: "", email: "" }),
    [p, P] = useState({ oldPassword: "", newPassword: "", confirmation: "" }),
    [msg, M] = useState(""),
    [err, E] = useState("");
  useEffect(() => {
    api
      .get("/api/profile")
      .then((r) => F({ fullName: r.data.fullName, email: r.data.email }));
  }, []);
  async function save(e) {
    e.preventDefault();
    M("");
    E("");
    try {
      const r = await api.put("/api/profile", f);
      localStorage.setItem("user", JSON.stringify(r.data));
      M("Profil mis à jour.");
    } catch (x) {
      E(x.response?.data?.message || "Mise à jour impossible.");
    }
  }
  async function pass(e) {
    e.preventDefault();
    M("");
    E("");
    try {
      const r = await api.put("/api/profile/password", p);
      M(r.data.message);
      P({ oldPassword: "", newPassword: "", confirmation: "" });
    } catch (x) {
      E(x.response?.data?.message || "Modification impossible.");
    }
  }
  return (
    <div className="page narrow">
      <div className="eyebrow">COMPTE</div>
      <h1>Mon profil</h1>
      {msg && <div className="success">{msg}</div>}
      {err && <div className="error">{err}</div>}
      <section className="panel">
        <h2>Informations personnelles</h2>
        <form onSubmit={save}>
          <label>
            Nom complet
            <input
              required
              value={f.fullName}
              onChange={(e) => F({ ...f, fullName: e.target.value })}
            />
          </label>
          <label>
            Adresse email
            <input
              type="email"
              required
              value={f.email}
              onChange={(e) => F({ ...f, email: e.target.value })}
            />
          </label>
          <button className="primary">Enregistrer</button>
        </form>
      </section>
      <section className="panel spaced">
        <h2>Changer le mot de passe</h2>
        <form onSubmit={pass}>
          <label>
            Ancien mot de passe
            <input
              type="password"
              required
              value={p.oldPassword}
              onChange={(e) => P({ ...p, oldPassword: e.target.value })}
            />
          </label>
          <label>
            Nouveau mot de passe
            <input
              type="password"
              minLength="8"
              required
              value={p.newPassword}
              onChange={(e) => P({ ...p, newPassword: e.target.value })}
            />
          </label>
          <label>
            Confirmation
            <input
              type="password"
              required
              value={p.confirmation}
              onChange={(e) => P({ ...p, confirmation: e.target.value })}
            />
          </label>
          <button className="primary">Changer le mot de passe</button>
        </form>
      </section>
    </div>
  );
}
