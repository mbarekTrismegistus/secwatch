import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { incidents } from "../services/incidentService";
import { auth } from "../services/authService";
export default function IncidentDetails() {
  const { id } = useParams(),
    [d, S] = useState(null),
    [err, E] = useState(""),
    [note, N] = useState("");
  async function load() {
    try {
      S(await incidents.detail(id));
    } catch (e) {
      E(e.response?.data?.message || "Incident introuvable.");
    }
  }
  useEffect(() => {
    load();
  }, [id]);
  async function status(v) {
    try {
      await incidents.status(id, v);
      load();
    } catch (e) {
      E(e.response?.data?.message || "Mise à jour impossible.");
    }
  }
  async function comment(e) {
    e.preventDefault();
    try {
      await incidents.comment(id, note);
      N("");
      load();
    } catch (x) {
      E(x.response?.data?.message || "Ajout impossible.");
    }
  }
  if (err)
    return (
      <div className="page">
        <div className="error">{err}</div>
      </div>
    );
  if (!d) return <div className="page">Chargement…</div>;
  const i = d.incident,
    role = auth.user()?.role;
  const lastAssignment = [...d.history]
    .reverse()
    .find((entry) => entry.message.startsWith("Incident affecté à "));
  const assignedName =
    i.assignedTo?.fullName ||
    lastAssignment?.message
      .replace("Incident affecté à ", "")
      .replace(/\.$/, "");
  return (
    <div className="page">
      <div className="eyebrow">
        INCIDENT #{i.id} · {i.category}
      </div>
      <div className="heading">
        <div>
          <h1>{i.title}</h1>
          <p>
            Déclaré par {i.createdBy?.fullName || "Utilisateur inconnu"} ·{" "}
            {new Date(i.createdAt).toLocaleString("fr-FR")}
          </p>
        </div>
        <span className="status large">{i.status}</span>
      </div>
      <div className="detail-grid">
        <section className="panel">
          <h2>Description</h2>
          <p className="description">{i.description}</p>
          <div className="meta">
            <span>
              Priorité <b>{i.priority}</b>
            </span>
            <span>
              Technicien affecté
              <b>{assignedName || "Non affecté"}</b>
            </span>
          </div>
          {["TECHNICIAN", "ADMIN"].includes(role) && i.status !== "CLOSED" && (
            <div className="actions">
              <label>
                Modifier le statut
                <select
                  value={i.status}
                  onChange={(e) => status(e.target.value)}
                >
                  {[
                    "OPEN",
                    "ASSIGNED",
                    "IN_PROGRESS",
                    "RESOLVED",
                    "CLOSED",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            </div>
          )}
          {["TECHNICIAN", "ADMIN"].includes(role) && (
            <form onSubmit={comment} className="note-form">
              <h2>Note de traitement</h2>
              <textarea
                required
                rows="3"
                value={note}
                onChange={(e) => N(e.target.value)}
                placeholder="Ajouter une note…"
              />
              <button className="primary">Ajouter la note</button>
            </form>
          )}
        </section>
        <aside className="panel">
          <h2>Historique</h2>
          <div className="timeline">
            {d.history.map((h) => (
              <div className="event" key={h.id}>
                <i />
                <div>
                  <b>{h.message}</b>
                  <small>
                    {h.actor.fullName} ·{" "}
                    {new Date(h.createdAt).toLocaleString("fr-FR")}
                  </small>
                </div>
              </div>
            ))}
          </div>
          <h2 className="comments-title">Notes</h2>
          {d.comments.map((c) => (
            <div className="comment" key={c.id}>
              <p>{c.content}</p>
              <small>
                {c.author.fullName} ·{" "}
                {new Date(c.createdAt).toLocaleString("fr-FR")}
              </small>
            </div>
          ))}
          {!d.comments.length && (
            <p className="muted">Aucune note pour le moment.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
