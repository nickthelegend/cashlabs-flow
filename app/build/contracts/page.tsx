"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import BlockPicker from "@/components/BlockPicker"
import CodePreview from "@/components/CodePreview"
import "../../blockly-custom.css"

const BlockWorkspace = dynamic(() => import("@/components/BlockWorkspace"), { ssr: false })

export default function ContractsPage() {
  const [toolboxXml, setToolboxXml] = useState<string>("")
  const [xml, setXml] = useState<string>("")
  const [code, setCode] = useState<string>("// Build your CashScript contract using blocks\n// This generates production-ready Bitcoin Cash smart contracts")



  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#0b0b0b",
      minWidth: 0,
      color: "#fff",
      flexDirection: "column"
    }}>
      <div style={{
        padding: "12px 16px",
        background: "linear-gradient(135deg, #1a1a1a 0%, #0a1f12 100%)",
        borderBottom: "2px solid #22c55e",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <h1 style={{
            fontSize: "20px",
            fontWeight: "bold",
            margin: 0,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{ color: "#22c55e" }}>₿</span>
            CashScript Contract Builder
            <span style={{
              fontSize: "10px",
              background: "#22c55e",
              color: "#000",
              padding: "2px 6px",
              borderRadius: "4px",
              fontWeight: "600"
            }}>PRO</span>
          </h1>
          <p style={{
            fontSize: "12px",
            color: "#888",
            margin: "4px 0 0 0"
          }}>
            Visual smart contract development for Bitcoin Cash
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <a
            href="https://cashscript.org/docs/"
            target="_blank"
            style={{
              padding: "8px 12px",
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "6px",
              color: "#22c55e",
              fontSize: "12px",
              textDecoration: "none"
            }}
          >
            📚 CashScript Docs
          </a>
        </div>
      </div>

      <div style={{
        display: "flex",
        flex: 1,
        minHeight: 0
      }}>
        <BlockPicker onToolboxXml={setToolboxXml} />

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
          background: "#111",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{
            padding: "12px",
            borderBottom: "1px solid #333",
            background: "#0a0a0a"
          }}>
            <div style={{
              fontSize: "12px",
              color: "#22c55e",
              fontWeight: "600",
              marginBottom: "4px"
            }}>
              Generated CashScript Code
            </div>
            <div style={{ fontSize: "10px", color: "#666" }}>
              Copy this code to use with the CashScript SDK
            </div>
          </div>
          <CodePreview xml={xml} code={code} />
        </div>
      </div>
    </div>
  )
}
