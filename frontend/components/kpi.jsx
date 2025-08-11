import "../styles/global.css";
import { useEffect, useRef, useState } from "react";
import { fetchData } from "../src/main";
import { useParams } from "react-router-dom";
import * as d3 from "d3";

export default function Kpi() {
  const svgRef = useRef();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [chartWidth, setChartWidth] = useState(200); // largeur par défaut

  // 🔹 Responsive : ajuste la taille en fonction du viewport
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    const handleChange = (e) => {
      setChartWidth(e.matches ? 160 : 200); // plus petit si < 1024px
    };

    mediaQuery.addEventListener("change", handleChange);
    handleChange(mediaQuery); // initialise

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Récupération des données
  useEffect(() => {
    fetchData(`/user/${id}`)
      .then(setUser)
      .catch((err) => setError(err.message));
  }, [id]);

  // Création du graphique
  useEffect(() => {
    if (!user) return;

    const score = user.todayScore ?? user.score;
    const percentage = score * 100;

    const width = chartWidth;
    const height = chartWidth;
    const innerRadius = width * 0.4; // proportionnel
    const outerRadius = width * 0.45; // proportionnel

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(width * 0.05);

    const pie = d3
      .pie()
      .startAngle(2 * Math.PI)
      .endAngle(0)
      .value((d) => d.value)
      .sort(null);

    const data = [
      { value: score, color: "#FF0000" },
      { value: 1 - score, color: "#FBFBFB" },
    ];

    const arcs = pie(data);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Cercle blanc central
    g.append("circle")
      .attr("r", innerRadius)
      .attr("fill", "#FFFFFF");

    // Arcs
    g.selectAll("path")
      .data(arcs)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color);

    // Texte au centre
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -width * 0.05)
      .attr("font-size", `${width * 0.12}px`)
      .attr("fill", "#282D30")
      .text(`${percentage}%`);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", width * 0.08)
      .attr("font-size", `${width * 0.07}px`)
      .attr("fill", "#74798C")
      .text("de votre");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", width * 0.17)
      .attr("font-size", `${width * 0.07}px`)
      .attr("fill", "#74798C")
      .text("objectif");
  }, [user, chartWidth]);

  if (error) return <p>Erreur : {error}</p>;
  if (!user) return <p>Chargement...</p>;

  return (
    <div className="kpi">
      <div>
        <p className="textKpi">Score</p>
      </div>
      <div className="chart">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}
