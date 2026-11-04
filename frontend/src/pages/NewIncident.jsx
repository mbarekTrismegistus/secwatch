import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { incidents } from "../services/incidentService";
export default function NewIncident() {
  const [f, F] = useState({
      title: "",
      description: "",
      category: "OTHER",
      priority: "MEDIUM",
    }),
    [e, E] = useState(""),
    n = useNavigate();
  function set(k, v) {
    F({ ...f, [k]: v });
  }
  async function go(ev) {
    ev.preventDefault();
    try {
      const i = await incidents.create(f);
      n(`/incidents/${i.id}`);
    } catch (x) {
      E(x.response?.data?.message || "Vérifiez les champs.");
    }
  }
  return (
    <div className="page narrow">
      <div className="eyebrow">NOUVEAU SIGNALEMENT</div>
      <h1>Déclarer un incident</h1>
      <p>Donnez les informations utiles à son traitement.</p>
      {e && <div className="error">{e}</div>}
      <section className="panel">
        <form onSubmit={go}>
          <label>
            Titre
            <input
              required
              maxLength="160"
              value={f.title}
              onChange={(x) => set("title", x.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              required
              rows="5"
              maxLength="5000"
              value={f.description}
              onChange={(x) => set("description", x.target.value)}
            />
          </label>
          <div className="form-row">
            <label>
              Catégorie
              <select
                value={f.category}
                onChange={(x) => set("category", x.target.value)}
              >
                {[
                  "NETWORK",
                  "MALWARE",
                  "PHISHING",
                  "ACCESS",
                  "SOFTWARE",
                  "HARDWARE",
                  "DATA_LEAK",
                  "OTHER",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Priorité
              <select
                value={f.priority}
                onChange={(x) => set("priority", x.target.value)}
              >
                {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>
          <button className="primary">Envoyer le signalement</button>
        </form>
      </section>
    </div>
  );
}
