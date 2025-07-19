import "../styles/global.css";
import { useEffect, useRef, useState } from "react";
import { fetchData } from "../src/main";
import { useParams } from "react-router-dom";
import * as d3 from "d3";

export default function Poid() {
  const svgRef = useRef();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(`/user/${id}/activity`)
      .then((json) => {
        const formatted = json.sessions.map((session, i) => ({
          day: i + 1, // transform le format des date en number
          kilogram: session.kilogram,
          calories: session.calories,
        }));
        // console.log("test max" ,formatted)
        setData(formatted);
      })
      .catch((err) => console.error("Erreur API :", err));
  }, [id]);

  useEffect(() => {
    if (!data) return;

    const width = 750;
    const height = 200;
    const margin = { top: 20, right: 40, bottom: 40, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // espace entre barres/ jours

    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d.day))
      .rangeRound([margin.left, width - margin.right])
      .paddingInner(0.3);

    // espace entre barre
    const x1 = d3
      .scaleBand()
      .domain(["kilogram", "calories"])
      .rangeRound([0, x0.bandwidth()])
      .padding(0.55);

    // echelle y a gauche , calories
    const yCalories = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.calories)])
      .nice()
      .rangeRound([height - margin.bottom, margin.top]);

    // echelle y a droite , poid
    const yKilogram = d3
      .scaleLinear()
      .domain([60, d3.max(data, (d) => d.kilogram)])
      .nice()
      .rangeRound([height - margin.bottom, margin.top]);

    // couleur des barres
    const color = d3
      .scaleOrdinal()
      .domain(["kilogram", "calories"])
      .range(["#000", "#E60000"]);

    svg.attr("width", width).attr("height", height);

    // Axe X (jours)
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0).tickFormat((d) => `${d}`))
      // .call((g) => {
      //   g.selectAll(".tick line").remove(); // Supprime les petites lignes des ticks
      //   g.select(".domain").remove(); // Supprime la ligne principale de l'axe
      // })
      .selectAll("text").attr("fill", "#74798C") 
      .style("font-size", "12px");

    // ➤ Axe Y gauche (calories)
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)

      .call(d3.axisLeft(yCalories).ticks(5))
      .call((g) => {
        g.selectAll(".tick line").remove();
        g.select(".domain").remove();
      }) 
      .selectAll("text").attr("fill", "#74798C") 
      .append("text") 
      .attr("x", 4)
      .attr("y", margin.top)
  
      .attr("text-anchor", "start");

    // ➤ Axe Y droite (kilogrammes)
    svg
      .append("g")
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(d3.axisRight(yKilogram).ticks(5))
      .call((g) => {
        g.selectAll(".tick line").remove();
        g.select(".domain").remove();
      })
       .selectAll("text").attr("fill", "#74798C") 
      .append("text")
      .attr("x", -4)
      .attr("y", margin.top)
      .attr("text-anchor", "end");

    // Barres
    const barGroups = svg
      .append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x0(d.day)},0)`);

    
     const rx = 6;
const ry = 6;

barGroups
  .selectAll("path")
  .data((d) => [
    { key: "calories", value: d.calories },
    { key: "kilogram", value: d.kilogram }
  ])
  .join("path")
  .attr("d", (d) => {
    const x = x1(d.key);
    const width = x1.bandwidth();
    const y = d.key === "calories" ? yCalories(d.value) : yKilogram(d.value);
    const height =
      d.key === "calories"
        ? yCalories(0) - yCalories(d.value)
        : yKilogram(60) - yKilogram(d.value);

    const path = d3.path();
    path.moveTo(x, y + ry);                 // départ coin haut gauche
    path.arcTo(x, y, x + rx, y, rx);        // arrondi haut gauche
    path.lineTo(x + width - rx, y);         // ligne droite sur le haut
    path.arcTo(x + width, y, x + width, y + ry, rx); // arrondi haut droit
    path.lineTo(x + width, y + height);     // côté droit
    path.lineTo(x, y + height);             // base
    path.closePath();                       // retour au point de départ

    return path.toString();
  })
  .attr("fill", (d) => color(d.key));
  }, [data]);

  return (
    <div className="poid">
      <div className="flex between">
        <div>
          <p className="titlePoid">Activité quotidienne</p>
        </div>
        <div className="contenerPoid flex between">
          <p className="grayColor"><span className="roundBlack"></span> Poid {`(kg)`}</p>
          <p className="grayColor"> <span className="roundRed"></span>Calories brûlées {`(kCal)`}</p>
        </div>
      </div>
      <div className="histogramme">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}
