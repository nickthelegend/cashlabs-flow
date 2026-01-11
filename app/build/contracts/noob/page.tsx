"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import BlockPickerNoob from "@/components/BlockPickerNoob"
import CodePreview from "@/components/CodePreview"
import "../../../blockly-custom.css"

const BlockWorkspace = dynamic(() => import("@/components/BlockWorkspace"), { ssr: false })

export default function NoobContractsPage() {
  const [toolboxXml, setToolboxXml] = useState<string>("")
  const [xml, setXml] = useState<string>("")
  const [code, setCode] = useState<string>("// 🎯 Build your Bitcoin Cash smart contract using simple blocks!")

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#0b0b0b",
      color: "#fff",
      flexDirection: "column"
    }}>
      <div style={{
        padding: "16px",
        background: "linear-gradient(135deg, #1a1a1a 0%, #0d2818 100%)",
        borderBottom: "2px solid #22c55e",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: "24px",
          fontWeight: "bold",
          margin: 0,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }}>
          <span style={{ color: "#22c55e" }}>₿</span>
          Easy Mode - Build Bitcoin Cash Smart Contracts!
        </h1>
        <p style={{
          fontSize: "14px",
          color: "#aaa",
          margin: "8px 0 0 0"
        }}>
          Drag blocks to create CashScript contracts - No coding experience needed!
        </p>
      </div>

      <div style={{
        display: "flex",
        flex: 1,
        minHeight: 0
      }}>
        <BlockPickerNoob onToolboxXml={setToolboxXml} />

        <div style={{ flex: 1, position: "relative" }}>
          <BlockWorkspace
            toolboxXml={toolboxXml}
            onXmlChanged={setXml}
            onJsChanged={setCode}
          />
        </div>

        <div style={{
          width: 500,
          borderLeft: "1px solid #22c55e",
          background: "#111"
        }}>
          <CodePreview xml={xml} code={code} />
        </div>
      </div>
    </div>
  )
}
