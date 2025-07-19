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

  useEffect(() => {
    fetchData(`/user/${id}`)
      .then(setUser)
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (!user) return;

    const score = user.todayScore ?? user.score; // Prend la bonne clé
    const percentage = score * 100;

    const width = 200;
    const height = 200;
    const innerRadius = 80;
    const outerRadius = 90;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Nettoyage

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(10);

    const pie = d3
      .pie()
      .startAngle(2 * Math.PI) // commence à droite
      .endAngle(0)
      .value((d) => d.value)
      .sort(null);

    const data = [
      { value: score, color: "#FF0000" }, // rempli
      { value: 1 - score, color: "#FBFBFB" }, // vide
    ];

    const arcs = pie(data);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

      g.append("circle")
  .attr("r", innerRadius)
  .attr("fill", "#FFFFFF");

    g.selectAll("path")
      .data(arcs)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color);

    // Texte : Pourcentage au centre
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -10)
      .attr("font-size", "24px")
      .attr("strike", "#282D30")
      .text(`${percentage}%`);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 15)
      .attr("font-size", "14px")
      .attr("fill", "#74798C")
      .text("de votre");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 35)
      .attr("font-size", "14px")
      .attr("fill", "#74798C")
      .text("objectif");
  }, [user]);

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
