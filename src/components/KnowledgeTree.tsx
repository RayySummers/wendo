"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import styles from "./KnowledgeTree.module.css";

interface TreeNode {
  name: string;
  label: string;
  children: (string | TreeNode)[];
}

const treeData: TreeNode[] = [
  {
    name: "cases",
    label: "cases/",
    children: [
      { name: "light-industry", label: "light-industry/", children: [] },
      { name: "electronics", label: "electronics/", children: [] },
      { name: "fashion", label: "fashion/", children: [] },
    ],
  },
  {
    name: "regions",
    label: "regions/",
    children: [
      { name: "us", label: "united-states/", children: ["newyork.md", "california.md", "texas.md"] },
      { name: "eu", label: "europe/", children: ["uk.md", "germany.md", "france.md"] },
      { name: "apac", label: "asiapacific/", children: ["japan.md", "korea.md", "singapore.md", "vietnam.md"] },
      { name: "africa", label: "africa/", children: [] },
      { name: "middleeast", label: "middleeast/", children: [] },
      { name: "latin-america", label: "latin-america/", children: [] },
      { name: "canada", label: "canada/", children: [] },
    ],
  },
  {
    name: "standards",
    label: "standards/",
    children: [
      { name: "global", label: "global.md", children: [] },
    ],
  },
  {
    name: "terminology",
    label: "terminology/",
    children: [
      { name: "tech", label: "tech.md", children: [] },
      { name: "finance", label: "finance.md", children: [] },
      { name: "medical", label: "medical.md", children: [] },
      { name: "legal", label: "legal.md", children: [] },
    ],
  },
];

interface TreeItemProps {
  node: TreeNode;
  depth: number;
}

function TreeItem({ node, depth }: TreeItemProps) {
  const isFile = node.label.endsWith(".md");
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children.length > 0;

  if (isFile) {
    return (
      <div className={styles.file} style={{ paddingLeft: `${12 + depth * 16}px` }}>
        {node.label}
      </div>
    );
  }

  return (
    <div className={styles.item}>
      <button
        className={styles.summary}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <motion.span
          className={styles.arrow}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          ▶
        </motion.span>
        <span className={styles.folder}>{node.label}</span>
      </button>
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            className={styles.children}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {node.children.map((child) =>
              typeof child === "string" ? (
                <div key={child} className={styles.file} style={{ paddingLeft: `${24 + depth * 16}px` }}>
                  {child}
                </div>
              ) : (
                <TreeItem key={child.name} node={child} depth={depth + 1} />
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function KnowledgeTree() {
  return (
    <div className={styles.tree}>
      <div className={styles.header}>
        <span className={styles.title}>知识库结构</span>
        <span className={styles.hint}>点击展开查看详情</span>
      </div>
      <div className={styles.list}>
        {treeData.map((node) => (
          <TreeItem key={node.name} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}