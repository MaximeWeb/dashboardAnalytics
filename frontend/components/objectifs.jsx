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
  const [chartWidth, setChartWidth] = useState(258); // largeur par défaut

  // 🔹 Responsive
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    const handleChange = (e) => {
      setChartWidth(e.matches ? 200 : 258); // réduit en dessous de 1024px
    };

    mediaQuery.addEventListener("change", handleChange);
    handleChange(mediaQuery); // initialisation

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Récupération des données
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

  // Création du graphique
  useEffect(() => {
    if (!data) return;

    const width = chartWidth;
    const height = chartWidth * 0.7; // proportionnel
    const marginTop = height * 0.21;
    const marginRight = 0;
    const marginBottom = height * 0.17;
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

    // Fond transparent pour désélectionner
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
        g.selectAll("text")
          .attr("fill", "#FFFFFF")
          .style("font-weight", "normal")
          .style("font-size", `${width * 0.045}px`);
      });

    // Courbe
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", width * 0.008)
      .attr("d", line);

    // Points cliquables
    const pointsGroup = svg.append("g").attr("class", "points-group");

    pointsGroup
      .selectAll("circle.click-zone")
      .data(data)
      .join("circle")
      .attr("class", "click-zone")
      .attr("cx", (d) => x(d.day))
      .attr("cy", (d) => y(d.sessionLength))
      .attr("r", width * 0.06) // proportionnel
      .attr("fill", "transparent")
      .style("cursor", "pointer")
      .on("mouseenter", (event, d) => {
        event.stopPropagation();
        if (selectedDay !== d.day) {
          setSelectedDay(d.day);
        }
      })
      .on("mouseout", () => {
        setSelectedDay(null);
      });

    // Point sélectionné + tooltip
    if (selectedDay !== null) {
      const selectedData = data.find((d) => d.day === selectedDay);

      pointsGroup
        .append("circle")
        .attr("class", "selected-point")
        .attr("cx", x(selectedDay))
        .attr("cy", y(selectedData.sessionLength))
        .attr("r", width * 0.023)
        .attr("fill", "white")
        .attr("pointer-events", "none");

      // Tooltip
      svg.selectAll("g.tooltip").remove();
      const tooltipGroup = svg
        .append("g")
        .attr("class", "tooltip")
        .attr("transform", `translate(${x(selectedDay)},${y(selectedData.sessionLength) - width * 0.06})`);

      tooltipGroup
        .append("rect")
        .attr("x", -width * 0.12)
        .attr("y", -width * 0.1)
        .attr("width", width * 0.24)
        .attr("height", width * 0.12)
        .attr("fill", "white")
        .attr("rx", 4);

      tooltipGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .style("font-size", `${width * 0.05}px`)
        .style("font-weight", "bold")
        .attr("dy", "-2px")
        .text(`${selectedData.sessionLength} min`);
    } else {
      svg.selectAll("g.tooltip").remove();
    }
  }, [data, selectedDay, chartWidth]);

  return (
    <div className="objectifs">
      <p className="textObjectifs">Durée moyenne des sessions</p>
      <div>
        <svg className="lineChart" ref={svgRef}></svg>
      </div>
    </div>
  );
}
