import "../styles/global.css";
import { useEffect, useRef, useState } from "react";
import { fetchData } from "../src/main";
import { useParams } from "react-router-dom";
import * as d3 from "d3";




export default function Radar() {
   const svgRef = useRef();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [kindMap, setKindMap] = useState(null);
    const [chartWidth, setChartWidth] = useState(258);

  useEffect(() => {
  const mediaQuery = window.matchMedia("(max-width: 1024px)");

  const handleChange = (e) => {
    setChartWidth(e.matches ? 200 : 258);
  };

  mediaQuery.addEventListener("change", handleChange);
  handleChange(mediaQuery); // initialise

  return () => mediaQuery.removeEventListener("change", handleChange);
}, []);



  const kindLabelsFr = {
    cardio: "Cardio",
    energy: "Énergie",
    endurance: "Endurance",
    strength: "Force",
    speed: "Vitesse",
    intensity: "Intensité"
  };

useEffect(() => {
  fetchData(`/user/${id}/performance`)
    .then((perf) => {
      setKindMap(perf.kind);
       const dataWithFr = perf.data.map(item => ({
        ...item,
        labelFr: kindLabelsFr[perf.kind[item.kind]]
          }));
      setData(dataWithFr);
    })
    .catch(console.error);
}, [id]);


  useEffect(() => {
  if (!data || !kindMap) return;

  const width = chartWidth;
  const height = chartWidth + 5; // garde un peu plus de hauteur proportionnelle
  const radius = width * 0.35;   // 🔹 proportionnel à la largeur
  const levels = 5;
  const maxValue = 250; 
  const angleSlice = (2 * Math.PI) / data.length;

  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove();
  svg.attr("width", width).attr("height", height);

  const center = { x: width / 2, y: height / 2 };
  const g = svg.append("g").attr("transform", `translate(${center.x}, ${center.y})`);

  const rScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

  // Hexagones concentriques
  for (let level = 1; level <= levels; level++) {
    const r = (radius / levels) * level;
    const points = data.map((_, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      return [r * Math.cos(angle), r * Math.sin(angle)];
    });
    g.append("polygon")
      .attr("points", points.map(p => p.join(",")).join(" "))
      .attr("stroke", "#f9f7f7ec")
      .attr("stroke-opacity", 0.3)
      .attr("fill", "none");
  }

  // Labels
  const labelRadius = radius * 1.25; // 🔹 proportionnel
  const fontSize = Math.max(8, width * 0.04); // 🔹 min 8px

  const axes = g.selectAll(".axis")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "axis");

  axes.append("text")
    .text(d => d.labelFr?.toUpperCase())
    .attr("x", (_, i) => labelRadius * Math.cos(i * angleSlice - Math.PI / 2))
    .attr("y", (_, i) => labelRadius * Math.sin(i * angleSlice - Math.PI / 2))
    .style("fill", "#f8f3f3ec")
    .style("font-size", `${fontSize}px`) // 🔹 taille responsive
    .style("text-anchor", "middle")
    .attr("dy", "0.35em");

  // Forme radar
  const radarLine = d3.lineRadial()
    .radius(d => rScale(d.value))
    .angle((_, i) => i * angleSlice)
    .curve(d3.curveLinearClosed);

  g.append("path")
    .datum(data)
    .attr("d", radarLine)
    .attr("fill", "#FF0101")
    .attr("fill-opacity", 0.7)
    .attr("stroke", "#FF0101")
    .attr("stroke-width", width * 0.008); // 🔹 épaisseur adaptative

}, [data, kindMap, chartWidth]); // chartWidth inclus ici


  return (
    <div className="radar">
      <svg ref={svgRef}></svg>
    </div>
  );
}