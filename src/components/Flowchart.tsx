"use client";

import { useEffect, useRef } from "react";
import styles from "./flowchart.module.css";

const nodes = [
  { id: "A", type: "start", label: "文档" },
  { id: "B", type: "diamond", label: "用户同意\n数据收集？" },
  { id: "C", type: "process", label: "数据脱敏化" },
  { id: "D", type: "process", label: "文档切分" },
  { id: "E", type: "process", label: "向量化" },
  { id: "F", type: "process", label: "ChromaDB" },
  { id: "G", type: "process", label: "知识库检索" },
  { id: "H", type: "process", label: "Harness Eng." },
  { id: "I", type: "process", label: "调用大语言模型" },
  { id: "J", type: "process", label: "生成诊断报告" },
  { id: "K", type: "process", label: "保存报告" },
  { id: "L", type: "process", label: "返回给用户" },
  { id: "M", type: "process", label: "通知人工审核" },
  { id: "N", type: "process", label: "用户主动联系" },
  { id: "O", type: "end", label: "结束" },
];

const connections = [
  { from: "A", to: "B" },
  { from: "B", to: "C", label: "是/否" },
  { from: "C", to: "D" },
  { from: "D", to: "E" },
  { from: "E", to: "F" },
  { from: "F", to: "G" },
  { from: "G", to: "H" },
  { from: "H", to: "I" },
  { from: "I", to: "J" },
  { from: "J", to: "K" },
  { from: "K", to: "L" },
  { from: "L", to: "M" },
  { from: "L", to: "N" },
  { from: "M", to: "O" },
  { from: "N", to: "O" },
];

export default function Flowchart() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const animate = () => {
      const pathLines = svg.querySelectorAll(`.${styles.line}`);
      const nodeGroups = svg.querySelectorAll(`.${styles.node}`);

      pathLines.forEach((line, i) => {
        const length = (line as SVGPathElement).getTotalLength?.() || 100;
        (line as SVGPathElement).style.strokeDasharray = `${length}`;
        (line as SVGPathElement).style.strokeDashoffset = `${length}`;
        (line as SVGPathElement).style.animation = `drawLine 0.5s ease forwards ${i * 0.08}s`;
      });

      nodeGroups.forEach((node, i) => {
        (node as SVGGElement).style.opacity = "0";
        (node as SVGGElement).style.animation = `fadeInNode 0.4s ease forwards ${i * 0.06 + 0.2}s`;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.container}>
      <svg
        ref={svgRef}
        viewBox="0 0 900 1400"
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-primary)" />
          </marker>
          <marker
            id="arrowhead-gray"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-text-muted)" />
          </marker>
        </defs>

        {connections.map((conn, i) => {
          const fromNode = nodes.find((n) => n.id === conn.from);
          const toNode = nodes.find((n) => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          const yPositions: Record<string, number> = {
            A: 60, B: 160, C: 270, D: 360, E: 450, F: 540, G: 630, H: 720,
            I: 810, J: 900, K: 990, L: 1080, M: 1170, N: 1170, O: 1300,
          };

          const xPositions: Record<string, number> = {
            A: 450, B: 450, C: 450, D: 450, E: 450, F: 450, G: 450, H: 450,
            I: 450, J: 450, K: 450, L: 450, M: 250, N: 650, O: 450,
          };

          const x1 = xPositions[conn.from];
          const y1 = yPositions[conn.from];
          const x2 = xPositions[conn.to];
          const y2 = yPositions[conn.to];

          let path = "";
          if (conn.from === "L" && conn.to === "M") {
            path = `M ${x1} ${y1} C ${x1} ${y1 + 50}, ${x2} ${y2 - 50}, ${x2} ${y2}`;
          } else if (conn.from === "L" && conn.to === "N") {
            path = `M ${x1} ${y1} C ${x1} ${y1 + 50}, ${x2} ${y2 - 50}, ${x2} ${y2}`;
          } else if (conn.from === "B" && conn.to === "C") {
            path = `M ${x1 - 50} ${y1} L ${x2} ${y2}`;
          } else {
            path = `M ${x1} ${y1} L ${x2} ${y2}`;
          }

          return (
            <path
              key={`${conn.from}-${conn.to}`}
              d={path}
              className={styles.line}
              fill="none"
              stroke={
                conn.from === "B" ? "var(--color-text-muted)" : "var(--color-primary)"
              }
              strokeWidth="2"
              markerEnd={
                conn.from === "B" ? "url(#arrowhead-gray)" : "url(#arrowhead)"
              }
            />
          );
        })}

        {nodes.map((node) => {
          const yPositions: Record<string, number> = {
            A: 60, B: 160, C: 270, D: 360, E: 450, F: 540, G: 630, H: 720,
            I: 810, J: 900, K: 990, L: 1080, M: 1170, N: 1170, O: 1300,
          };
          const xPositions: Record<string, number> = {
            A: 450, B: 450, C: 450, D: 450, E: 450, F: 450, G: 450, H: 450,
            I: 450, J: 450, K: 450, L: 450, M: 250, N: 650, O: 450,
          };

          const cx = xPositions[node.id];
          const cy = yPositions[node.id];

          if (node.type === "diamond") {
            const size = 60;
            return (
              <g key={node.id} className={styles.node}>
                <polygon
                  points={`${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`}
                  className={styles.diamond}
                />
                <text x={cx} y={cy + 4} className={styles.nodeLabel}>
                  {node.label.split("\n").map((line, i) => (
                    <tspan key={i} x={cx} dy={i === 0 ? -6 : 14}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          }

          if (node.type === "start" || node.type === "end") {
            const width = 100;
            const height = 40;
            return (
              <g key={node.id} className={styles.node}>
                <rect
                  x={cx - width / 2}
                  y={cy - height / 2}
                  width={width}
                  height={height}
                  rx={height / 2}
                  className={node.type === "start" ? styles.startNode : styles.endNode}
                />
                <text x={cx} y={cy + 4} className={styles.nodeLabelSmall}>
                  {node.label}
                </text>
              </g>
            );
          }

          const width = 140;
          const height = 50;
          return (
            <g key={node.id} className={styles.node}>
              <rect
                x={cx - width / 2}
                y={cy - height / 2}
                width={width}
                height={height}
                rx={10}
                className={styles.processNode}
              />
              <text x={cx} y={cy + 4} className={styles.nodeLabel}>
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}