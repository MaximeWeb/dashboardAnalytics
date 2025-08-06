import "../styles/global.css";
import { useEffect, useRef, useState } from "react";
import { fetchData } from "../src/main";
import { useParams } from "react-router-dom";
import * as d3 from "d3";

export default function Poid() {
  const svgRef = useRef(); // d3 manipulation du dom
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

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
  const margin = { top: 20, right: 50, bottom: 40, left: 40 };

  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove();

  const x0 = d3
    .scaleBand()
    .domain(data.map((d) => d.day))
    .rangeRound([margin.left, width - margin.right])
    .paddingInner(0.3);
    
    
   

  const x1 = d3
    .scaleBand()
    .domain(["kilogram", "calories"])
    .rangeRound([0, x0.bandwidth()])
    .padding(0.55);

  const yCalories = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.calories)])
    .nice()
    .rangeRound([height - margin.bottom, margin.top]);

  const yKilogram = d3
    .scaleLinear()
    .domain([60, d3.max(data, (d) => d.kilogram)])
    .nice()
    .rangeRound([height - margin.bottom, margin.top]);

  const color = d3
    .scaleOrdinal()
    .domain(["kilogram", "calories"])
    .range(["#000", "#E60000"]);

  svg.attr("width", width).attr("height", height);

  // FOND GRIS
if (selectedDay !== null) {
  const offset = 20; // marge haut gris
  svg.append("rect")
    .attr("x", x0(selectedDay))
    .attr("y", margin.top - offset)  // décale vers le haut
    .attr("width", x0.bandwidth())
    .attr("height", height - margin.top - margin.bottom + offset) 
    .attr("fill", "#C4C4C480");
}

  // Axe X
svg.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x0).tickFormat((d) => `${d}`))
  .call((g) => {
    g.select(".domain")
      .attr("stroke", "#DEDEDE"); // Couleur de la ligne principale de l'axe
    g.selectAll(".tick line").remove(); // Supprime les petites lignes des ticks
  })
  .selectAll("text")
    .attr("fill", "#74798C")
    .style("font-size", "12px");

  // Axe Y gauche
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yCalories).ticks(5))
    .call((g) => {

      g.selectAll(".tick line").remove();
      g.select(".domain").remove();
    })
    .selectAll("text").attr("fill", "#74798C");

  // Axe Y droite
  svg.append("g")
    .attr("transform", `translate(${width - margin.right},0)`)
    .call(d3.axisRight(yKilogram).ticks(5))
    .call((g) => {
      g.selectAll(".tick line").remove();
      g.select(".domain").remove();
    })
    .selectAll("text").attr("fill", "#74798C");

  // Barres
  const barGroups = svg.append("g")
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (d) => `translate(${x0(d.day)},0)`);

  const rx = 6;
  const ry = 6;

  barGroups
  .on("mouseover", function (event, d) {
    setSelectedDay(d.day);                      // evenement hover , prend les 2 barre en groupe
  })
  .on("mouseout", function () {
    setSelectedDay(null);
  });

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
      const heightVal =
        d.key === "calories"
          ? yCalories(0) - yCalories(d.value)
          : yKilogram(60) - yKilogram(d.value);

      const path = d3.path();  // ici on va donner du radius a nos barres
      path.moveTo(x, y + ry);
      path.arcTo(x, y, x + rx, y, rx);
      path.lineTo(x + width - rx, y);
      path.arcTo(x + width, y, x + width, y + ry, rx);
      path.lineTo(x + width, y + heightVal);
      path.lineTo(x, y + heightVal);
      path.closePath();

      return path.toString();
    })
    .attr("fill", (d) => color(d.key))
    .style("cursor", "pointer")
    // .on("mouseover", function (event, d) {    // onclick sur les barres 
    //   const day = d3.select(this.parentNode).datum().day;
    //   setSelectedDay((prev) => (prev === day ? null : day));
    // });

  // Tooltip rouge
  if (selectedDay !== null) {
    const selectedData = data.find(d => d.day === selectedDay); // data.find pour recuperer les data 

    const tooltipGroup = svg.append("g")
      .attr("transform", `translate(${x0(selectedDay) + x0.bandwidth() + 8},${margin.top - 20})`);

    tooltipGroup.append("rect")
      .attr("width", 40)
      .attr("height", 63)
      .attr("fill", "#E60000")
      // .attr("rx", 6)
      // .attr("ry", 6);

    tooltipGroup.append("text")
      .attr("x", 10)
      .attr("y", 20)
      .attr("fill", "white")
      .style("font-size", "7px")
      .text(`${selectedData.kilogram}kg`);

    tooltipGroup.append("text")
      .attr("x", 10)
      .attr("y", 50)
      .attr("fill", "white")
      .style("font-size", "7px")
      .text(`${selectedData.calories}kCal`);
  }
}, [data, selectedDay]);


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
