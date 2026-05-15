"use client";

import { useEffect, useRef } from "react";
import styles from "./flowchart.module.css";

interface FlowNode {
  id: string;
  type: "start" | "end" | "process" | "diamond";
  label: string;
  y: number;
  x?: number;
}

const flowNodes: FlowNode[] = [
  { id: "A", type: "start", label: "文档提交", y: 0 },
  { id: "B", type: "diamond", label: "用户同意\n数据收集？", y: 110 },
  { id: "C", type: "process", label: "数据脱敏化", y: 210 },
  { id: "D", type: "process", label: "文档切分", y: 310 },
  { id: "E", type: "process", label: "向量化 Embedding", y: 410 },
  { id: "F", type: "process", label: "ChromaDB 存储", y: 510 },
  { id: "G", type: "process", label: "知识库检索", y: 610 },
  { id: "H", type: "process", label: "Harness Engineering", y: 710 },
  { id: "I", type: "process", label: "调用大语言模型", y: 810 },
  { id: "J", type: "process", label: "生成诊断报告", y: 910 },
  { id: "K", type: "process", label: "保存报告", y: 1010 },
  { id: "L", type: "process", label: "返回给用户", y: 1110 },
  { id: "M", type: "process", label: "通知人工审核", y: 1180, x: 180 },
  { id: "N", type: "process", label: "用户主动联系", y: 1180, x: 540 },
  { id: "O", type: "end", label: "结束", y: 1320 },
];

interface Connection {
  from: string;
  to: string;
}

const connections: Connection[] = [
  { from: "A", to: "B" },
  { from: "B", to: "C" },
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          container.classList.add(styles.visible);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const getPosition = (id: string) => {
    const node = flowNodes.find((n) => n.id === id);
    return {
      x: node?.x ?? 360,
      y: node?.y ?? 0,
    };
  };

  const renderConnections = () => {
    return connections.map((conn, i) => {
      const from = getPosition(conn.from);
      const to = getPosition(conn.to);

      const isLeftBranch = conn.to === "M";
      const isRightBranch = conn.to === "N";

      let path: string;
      if (isLeftBranch || isRightBranch) {
        const startX = from.x;
        const startY = from.y + 50;
        const endX = to.x;
        const endY = to.y - 30;
        const midY = (startY + endY) / 2;
        path = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
      } else {
        const startY = from.y + 50;
        path = `M ${from.x} ${startY} L ${to.x} ${to.y - 30}`;
      }

      return (
        <path
          key={`conn-${i}`}
          d={path}
          className={styles.connectionLine}
          fill="none"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      );
    });
  };

  const renderNodes = () => {
    return flowNodes.map((node) => {
      const x = node.x ?? 360;
      const y = node.y;

      if (node.type === "start") {
        return (
          <g key={node.id} className={styles.nodeGroup}>
            <rect
              x={x - 60}
              y={y - 25}
              width={120}
              height={50}
              rx={25}
              className={styles.startNode}
            />
            <text x={x} y={y + 5} className={styles.startText}>
              {node.label}
            </text>
          </g>
        );
      }

      if (node.type === "end") {
        return (
          <g key={node.id} className={styles.nodeGroup}>
            <circle cx={x} cy={y} r={30} className={styles.endNode} />
            <text x={x} y={y + 5} className={styles.endText}>
              {node.label}
            </text>
          </g>
        );
      }

      if (node.type === "diamond") {
        const size = 50;
        return (
          <g key={node.id} className={styles.nodeGroup}>
            <polygon
              points={`${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`}
              className={styles.diamondNode}
            />
            <text x={x} y={y - 5} className={styles.diamondText}>
              {node.label.split("\n")[0]}
            </text>
            <text x={x} y={y + 12} className={styles.diamondText}>
              {node.label.split("\n")[1]}
            </text>
          </g>
        );
      }

      return (
        <g key={node.id} className={styles.nodeGroup}>
          <rect
            x={x - 80}
            y={y - 30}
            width={160}
            height={60}
            rx={12}
            className={styles.processNode}
          />
          <text x={x} y={y + 5} className={styles.processText}>
            {node.label}
          </text>
        </g>
      );
    });
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <svg
        viewBox="0 0 720 1380"
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="var(--color-primary)" />
          </marker>
        </defs>

        {renderConnections()}
        {renderNodes()}
      </svg>
    </div>
  );
}