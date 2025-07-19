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


useEffect(() => {
  fetchData(`/user/${id}/performance`)
    .then((perf) => {
      setKindMap(perf.kind);
      setData(perf.data);
    })
    .catch(console.error);
}, [id]);


  useEffect(() => {
    if (!data || !kindMap) return;

    const width = 258;
    const height = 263;
    const radius = 90;
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

    // Axes
    const axes = g.selectAll(".axis")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "axis");

    // axes.append("line")
    //   .attr("x1", 0)
    //   .attr("y1", 0)
    //   .attr("x2", (_, i) => rScale(maxValue) * Math.cos(i * angleSlice - Math.PI / 2))
    //   .attr("y2", (_, i) => rScale(maxValue) * Math.sin(i * angleSlice - Math.PI / 2))
    //   .attr("stroke", "#FFFFFF")
    //   .attr("stroke-opacity", 0.5);

    // Labels
const labelRadius = radius * 1.3;

axes.append("text")
  .text(d => kindMap[d.kind]?.toUpperCase())
  .attr("x", (_, i) => labelRadius * Math.cos(i * angleSlice - Math.PI / 2))
  .attr("y", (_, i) => labelRadius * Math.sin(i * angleSlice - Math.PI / 2))
  .style("fill", "#f8f3f3ec")
  .style("font-size", "10px")
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
      .attr("stroke-width", 2);

  }, [data, kindMap]);

  return (
    <div className="radar">
      <svg ref={svgRef}></svg>
    </div>
  );
}