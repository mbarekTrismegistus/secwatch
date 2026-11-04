import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Users,
} from "lucide-react";
import { auth } from "../services/authService";
import { api } from "../services/api";
import { incidents } from "../services/incidentService";
import { buttonVariants } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";

const metricIcons = {
  Incidents: ClipboardList,
  "Mes incidents": ClipboardList,
  Affectés: ClipboardList,
  Utilisateurs: Users,
  Employés: Users,
  Techniciens: Users,
  Ouverts: CircleDot,
  "En cours": Activity,
  Critiques: AlertTriangle,
  Résolus: CheckCircle2,
  "Résolus / clôturés": CheckCircle2,
  Clôturés: CheckCircle2,
};

export default function Dashboard() {
  const role = auth.user()?.role;
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        if (role === "ADMIN") {
          const { data: dashboard } = await api.get("/api/admin/dashboard");
          if (!Array.isArray(dashboard.incidents)) {
            throw new Error(
              "L’API admin n’a pas renvoyé la liste des incidents.",
            );
          }
          if (
            dashboard.statistics.totalIncidents !== dashboard.incidents.length
          ) {
            throw new Error(
              `L’API compte ${dashboard.statistics.totalIncidents} incidents, mais en a renvoyé ${dashboard.incidents.length}.`,
            );
          }
          setData({ stats: dashboard.statistics, items: dashboard.incidents });
          return;
        }

        const items =
          role === "TECHNICIAN"
            ? await incidents.assigned()
            : await incidents.mine();
        setData({ items });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Le tableau de bord ne peut pas être chargé.",
        );
      }
    }

    loadDashboard();
  }, [role]);

  if (!data) {
    return (
      <div className="page">
        <div className="eyebrow">Vue d’ensemble</div>
        <h1>Tableau de bord</h1>
        {error ? (
          <div className="error">{error}</div>
        ) : (
          <p>Chargement des données…</p>
        )}
      </div>
    );
  }

  const items = data.items || [];
  const stats = data.stats || {};
  const cards =
    role === "ADMIN"
      ? [
          ["Utilisateurs", stats.totalUsers],
          ["Employés", stats.employees],
          ["Techniciens", stats.technicians],
          ["Incidents", stats.totalIncidents],
          ["Ouverts", stats.open],
          ["En cours", stats.in_progress],
          ["Clôturés", stats.closed],
          ["Critiques", stats.critical],
        ]
      : role === "TECHNICIAN"
        ? [
            ["Affectés", items.length],
            [
              "Critiques",
              items.filter((item) => item.priority === "CRITICAL").length,
            ],
            [
              "En cours",
              items.filter((item) => item.status === "IN_PROGRESS").length,
            ],
            [
              "Résolus",
              items.filter((item) => item.status === "RESOLVED").length,
            ],
          ]
        : [
            ["Mes incidents", items.length],
            ["Ouverts", items.filter((item) => item.status === "OPEN").length],
            [
              "En cours",
              items.filter((item) => item.status === "IN_PROGRESS").length,
            ],
            [
              "Résolus / clôturés",
              items.filter((item) =>
                ["RESOLVED", "CLOSED"].includes(item.status),
              ).length,
            ],
          ];

  const firstName = auth.user()?.fullName?.trim().split(" ")[0];
  const listTitle =
    role === "EMPLOYEE"
      ? "Mes derniers incidents"
      : role === "TECHNICIAN"
        ? "Incidents affectés"
        : "Incidents récents";

  return (
    <div className="page">
      <div className="heading dashboard-heading">
        <div>
          <div className="eyebrow">Espace {role?.toLowerCase()}</div>
          <h1>Bonjour{firstName ? `, ${firstName}` : ""}</h1>
          <p>Voici les derniers éléments à suivre.</p>
        </div>
        {role === "EMPLOYEE" && (
          <Link
            to="/incidents/new"
            className={cn(buttonVariants(), "linkbutton")}
          >
            <ClipboardList size={16} />
            Signaler un incident
            <ArrowRight size={15} />
          </Link>
        )}
      </div>

      <div className="stats">
        {cards.map(([label, value]) => {
          const Icon = metricIcons[label] || ClipboardList;
          return (
            <Card className="stat" key={label}>
              <div className="stat-label">
                <span>{label}</span>
                <span className="stat-icon">
                  <Icon size={15} />
                </span>
              </div>
              <strong>{value ?? 0}</strong>
              <small>
                {label === "Critiques"
                  ? "Priorité critique"
                  : "Mis à jour en direct"}
              </small>
            </Card>
          );
        })}
      </div>

      <section className="panel dashboard-panel">
        <div className="panel-head">
          <div>
            <h2>{listTitle}</h2>
            <p>Consultez l’état et la priorité de chaque signalement.</p>
          </div>
          <Link
            to={
              role === "TECHNICIAN"
                ? "/assigned"
                : role === "ADMIN"
                  ? "/admin/incidents"
                  : "/incidents"
            }
          >
            Voir la liste <ArrowRight size={14} />
          </Link>
        </div>
        <IncidentTable items={items.slice(0, 6)} />
      </section>
    </div>
  );
}

export function IncidentTable({ items }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Incident</th>
            <th>Catégorie</th>
            <th>Priorité</th>
            <th>État</th>
            <th>Créé le</th>
          </tr>
        </thead>
        <tbody>
          {items.map((incident) => (
            <tr key={incident.id}>
              <td>
                <Link to={`/incidents/${incident.id}`}>
                  <span className="incident-title">{incident.title}</span>
                  <small>
                    #{incident.id} · {incident.createdBy?.fullName}
                  </small>
                </Link>
              </td>
              <td>{incident.category}</td>
              <td>
                <Badge className={`priority ${incident.priority}`}>
                  {incident.priority}
                </Badge>
              </td>
              <td>
                <Badge variant="secondary" className="status">
                  {incident.status}
                </Badge>
              </td>
              <td>
                {new Date(incident.createdAt).toLocaleDateString("fr-FR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!items.length && <p className="empty">Aucun incident à afficher.</p>}
    </div>
  );
}
