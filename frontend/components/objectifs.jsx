import "../styles/global.css";
import { useEffect, useRef, useState } from "react";
import { fetchData } from "../src/main";
import { useParams } from "react-router-dom";
import * as d3 from "d3";

export default function Objectifs() {
  const svgRef = useRef();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetchData(`/user/${id}/average-sessions`)
      .then((json) => {
        const formatted = json.sessions.map((session) => ({
          day: session.day,
          sessionLength: session.sessionLength,
        }));
        setData(formatted);
      })
      .catch((err) => console.error("Erreur API :", err));
  }, [id]);

  useEffect(() => {
    if (!data) return;

    const width = 258;
    const height = 180;
    const marginTop = 38;
    const marginRight = 0;
    const marginBottom = 30;
    const marginLeft = 0;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3.scaleLinear().domain([1, 7]).range([marginLeft, width - marginRight]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.sessionLength)])
      .nice()
      .range([height - marginBottom, marginTop]);

    const xAxisScale = d3.scaleLinear().domain([0.5, 7.5]).range([marginLeft, width - marginRight]);

    const line = d3
      .line()
      .x((d) => x(d.day))
      .y((d) => y(d.sessionLength))
      .curve(d3.curveMonotoneX);

    svg.attr("width", width).attr("height", height).attr("viewBox", [0, 0, width, height]);

    // Fond transparent pour capturer clic hors des points (désélection)
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .on("click", () => setSelectedDay(null));

    // Axe X
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(xAxisScale)
          .tickValues([1, 2, 3, 4, 5, 6, 7])
          .tickFormat((d) => ["L", "M", "M", "J", "V", "S", "D"][d - 1])
      )
      .call((g) => {
        g.selectAll(".tick line").remove();
        g.select(".domain").remove();
        g.selectAll("text").attr("fill", "#FFFFFF").style("font-weight", "normal").style("font-size", "12px");
      });

    // Ligne de la courbe
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Groupe pour les cercles cliquables et les points visibles
    const pointsGroup = svg.append("g").attr("class", "points-group");

    // Cercles invisibles pour zones de clic, plus larges pour faciliter
    pointsGroup
      .selectAll("circle.click-zone")
      .data(data)
      .join("circle")
      .attr("class", "click-zone")
      .attr("cx", (d) => x(d.day))
      .attr("cy", (d) => y(d.sessionLength))
      .attr("r", 15) // plus large pour faciliter clic
      .attr("fill", "transparent")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation(); // empêcher le clic sur le fond de déclencher la désélection
        setSelectedDay((prev) => (prev === d.day ? null : d.day));
      });

    // Cercle blanc visible uniquement si sélectionné
    pointsGroup.selectAll("circle.selected-point").remove(); // clean avant d'ajouter

    if (selectedDay !== null) {
      const selectedData = data.find((d) => d.day === selectedDay);

      pointsGroup
        .append("circle")
        .attr("class", "selected-point")
        .attr("cx", x(selectedDay))
        .attr("cy", y(selectedData.sessionLength))
        .attr("r", 6)
        .attr("fill", "white")
        .attr("pointer-events", "none"); // ignore les événements souris

      // Tooltip blanc
      // Nettoyer tooltip avant d'ajouter
      svg.selectAll("g.tooltip").remove();

      const tooltipGroup = svg
        .append("g")
        .attr("class", "tooltip")
        .attr("transform", `translate(${x(selectedDay)},${y(selectedData.sessionLength) - 15})`);

      tooltipGroup
        .append("rect")
        .attr("x", -30)
        .attr("y", -25)
        .attr("width", 60)
        .attr("height", 30)
        .attr("fill", "white")
        .attr("filter", "drop-shadow(0 0 2px rgba(0,0,0,0.2))");

      tooltipGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr("dy", "-5px")
        .text(`${selectedData.sessionLength} min`);
    } else {
      // Si aucune sélection, on enlève tooltip s’il existe
      svg.selectAll("g.tooltip").remove();
      pointsGroup.selectAll("circle.selected-point").remove();
    }
  }, [data, selectedDay]);

  return (
    <div className="objectifs">
        <p className="textObjectifs">Durée moyenne des sessions</p>
      <div >
        <svg className="lineChart" ref={svgRef}></svg>
      </div>
    </div>
  );
}

