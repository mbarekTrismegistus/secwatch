import { useEffect, useState } from "react";
import { api } from "../services/api";
export default function AdminIncidents() {
  const [a, S] = useState([]),
    [tech, T] = useState([]),
    [err, E] = useState("");
  async function load() {
    try {
      const [i, u] = await Promise.all([
        api.get("/api/admin/dashboard"),
        api.get("/api/admin/users"),
      ]);
      if (!Array.isArray(i.data.incidents)) {
        throw new Error("L’API admin n’a pas renvoyé la liste des incidents.");
      }
      if (i.data.statistics.totalIncidents !== i.data.incidents.length) {
        throw new Error(
          `L’API compte ${i.data.statistics.totalIncidents} incidents, mais en a renvoyé ${i.data.incidents.length}.`,
        );
      }
      S(i.data.incidents);
      T(u.data.filter((x) => x.role === "TECHNICIAN" && x.enabled));
    } catch (e) {
      E(e.response?.data?.message || e.message || "Chargement impossible.");
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function assign(id, who) {
    if (!who) return;
    try {
      await api.put(`/api/incidents/${id}/assign/${who}`);
      load();
    } catch (e) {
      E(e.response?.data?.message || "Affectation impossible.");
    }
  }
  return (
    <div className="page">
      <div className="eyebrow">ADMINISTRATION</div>
      <h1>Affectation des incidents</h1>
      <p>Assignez un technicien actif à chaque signalement.</p>
      {err && <div className="error">{err}</div>}
      <section className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Incident</th>
              <th>État</th>
              <th>Priorité</th>
              <th>Technicien affecté</th>
            </tr>
          </thead>
          <tbody>
            {a.length ? (
              a.map((i) => (
                <tr key={i.id}>
                  <td>
                    #{i.id} · {i.title}
                    <small>
                      {i.createdBy?.fullName || "Utilisateur inconnu"}
                    </small>
                  </td>
                  <td>{i.status}</td>
                  <td>{i.priority}</td>
                  <td>
                    <select
                      value={i.assignedTo?.id || ""}
                      onChange={(e) => assign(i.id, e.target.value)}
                    >
                      <option value="">Non affecté</option>
                      {tech.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.fullName}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty">
                  Aucun incident à afficher.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
