import { useEffect, useState } from "react";
import { incidents } from "../services/incidentService";
import { IncidentTable } from "./Dashboard";
export default function AssignedIncidents() {
  const [a, S] = useState([]);
  useEffect(() => {
    incidents
      .assigned()
      .then(S)
      .catch(() => S([]));
  }, []);
  return (
    <div className="page">
      <div className="eyebrow">FILE DE TRAITEMENT</div>
      <h1>Incidents affectés</h1>
      <section className="panel">
        <IncidentTable items={a} />
      </section>
    </div>
  );
}
