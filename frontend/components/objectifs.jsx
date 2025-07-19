import "../styles/global.css";
import { useEffect, useRef, useState } from "react";
import { fetchData } from "../src/main";
import { useParams } from "react-router-dom";
import * as d3 from "d3";

export default function Objectifs() {
  const svgRef = useRef();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(`/user/${id}/average-sessions`)
      .then((json) => {
        const formatted = json.sessions.map((session) => ({
          day: session.day,
          sessionLength: session.sessionLength,
        }));
        // console.log(formatted)
        setData(formatted);
      })
      .catch((err) => console.error("Erreur API :", err));
  }, [id]);

  useEffect(() => {
    if (!data) return;

    const width = 258;
    const height = 180;
    const marginTop = 20;
    const marginRight = 0;
    const marginBottom = 30;
    const marginLeft = 0;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Echelle X : jours de 1 à 7 (pas une date ici)
const x = d3
  .scaleLinear()
  .domain([1, 7])
  .range([marginLeft, width - marginRight]);

    // Echelle Y : sessionLength
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.sessionLength)])
      .nice()
      .range([height - marginBottom, marginTop]);

      const xAxisScale = d3
  .scaleLinear()
  .domain([0.5, 7.5])
  .range([marginLeft, width - marginRight]);

    const line = d3
      .line()
      .x((d) => x(d.day))
      .y((d) => y(d.sessionLength))
      .curve(d3.curveMonotoneX); // lissage sympa

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // Axe X
 svg
  .append("g")
  .attr("transform", `translate(0,${height - marginBottom})`)
  
  
  .call(
    d3
      .axisBottom(xAxisScale)
      .tickValues([1, 2, 3, 4, 5, 6, 7])
      .tickFormat((d) => ["L", "M", "M", "J", "V", "S", "D"][d - 1]) // transorm format des jours
  )
  .call((g) => {
    g.selectAll(".tick line").remove();
    g.select(".domain").remove();
     g.selectAll("text") // <--- cible les textes des ticks
    .attr("fill", "#FFFFFF") // ou autre couleur souhaitée
    .style("font-weight", "normal") // <-- enlève l'effet "gras"
    .style("font-size", "12px"); // optionnel : ajuste la taille
  });
    // Axe Y
    // svg
    //   .append("g")
    //   .attr("transform", `translate(${marginLeft},0)`)
    //   .call(d3.axisLeft(y).ticks(5))
    //   .call((g) => g.select(".domain").remove())
    //   .call((g) =>
    //     g
    //       .selectAll(".tick line")
    //       .clone()
    //       .attr("x2", width - marginLeft - marginRight)
    //       .attr("stroke-opacity", 0.1)
    //   )
    //   .call((g) =>
    //     g
    //       .append("text")
    //       .attr("x", -marginLeft)
    //       .attr("y", 10)
    //       .attr("fill", "currentColor")
    //       .attr("text-anchor", "start")
    //       .text("Durée session (min)")
    //   );

    // Ligne
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [data]);

  return (
    <div className="objectifs">
      <p className="textObjectifs">Durée moyenne des sessions</p>
      <div className="lineChart">
            <svg ref={svgRef}></svg>
      </div>
  
    </div>
  );
}
// import "../styles/global.css";

// export default function topNavBar() {


//   return (
//     <div className='containerTopNavBar'>
//       <div className="nav flex between">
        

// <img className="imgTopNav" src="/logo.png" alt="logo" />
       

// <p className="buttonTopNav">Accueil</p>
// <p className="buttonTopNav">Profil</p>
// <p className="buttonTopNav">Réglages</p>
// <p className="buttonTopNav">Communauté</p>
//       </div>
//     </div>
//   );
// }
