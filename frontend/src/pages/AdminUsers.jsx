import { useEffect, useState } from "react";
import { api } from "../services/api";
export default function AdminUsers() {
  const [a, S] = useState([]),
    [e, E] = useState("");
  async function load() {
    try {
      S((await api.get("/api/admin/users")).data);
    } catch (x) {
      E(x.response?.data?.message || "Erreur de chargement.");
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function toggle(u) {
    await api.put(
      `/api/admin/users/${u.id}/${u.enabled ? "disable" : "enable"}`,
    );
    load();
  }
  return (
    <div className="page">
      <div className="eyebrow">ADMINISTRATION</div>
      <h1>Utilisateurs</h1>
      <p>Gérez les comptes et leur accès à SecWatch.</p>
      {e && <div className="error">{e}</div>}
      <section className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {a.map((u) => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.enabled ? "Actif" : "Désactivé"}</td>
                <td>
                  <button className="small-btn" onClick={() => toggle(u)}>
                    {u.enabled ? "Désactiver" : "Activer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
