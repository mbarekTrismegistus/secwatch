import { useEffect, useState } from "react";
import { incidents } from "../services/incidentService";
import { IncidentTable } from "./Dashboard";
export default function MyIncidents() {
  const [a, S] = useState([]),
    [e, E] = useState("");
  useEffect(() => {
    incidents
      .mine()
      .then(S)
      .catch((x) => E(x.response?.data?.message || "Chargement impossible."));
  }, []);
  return (
    <div className="page">
      <div className="eyebrow">SUIVI</div>
      <h1>Mes incidents</h1>
      <p>Consultez l’avancement de vos signalements.</p>
      {e && <div className="error">{e}</div>}
      <section className="panel">
        <IncidentTable items={a} />
      </section>
    </div>
  );
}
