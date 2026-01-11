"use client"

import { Button } from "@/components/ui/button"
import { Download, Copy, Play, FileCode } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Editor from "@monaco-editor/react"

export default function CodePreview({
  xml,
  code
}: {
  xml: string
  code: string
}) {

  const handleOpenPlayground = () => {
    // CashScript playground uses a different format, but we can at least copy and provide a link
    window.open('https://playground.cashscript.org/', '_blank')
    toast({
      title: "Opening Playground",
      description: "Paste your code into the CashScript Playground",
      duration: 3000,
    })
  }

  const handleDownload = () => {
    const isCashScript = code.includes('pragma cashscript') || code.includes('contract')
    const extension = isCashScript ? 'cash' : 'js'
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `contract-${Date.now()}.${extension}`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Code Exported",
      description: `Contract code (.${extension}) downloaded successfully`,
      duration: 2000,
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
      duration: 2000,
    })
  }

  const handleDownloadXml = () => {
    const blob = new Blob([xml], { type: "text/xml" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cashlabs-workspace-${Date.now()}.xml`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Workspace Exported",
      description: "Blockly workspace XML downloaded successfully",
      duration: 2000,
    })
  }

  return (
    <div style={{
      height: "100%",
      overflow: "auto",
      color: "#e6e6e6",
      background: "#0a0a0a",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        padding: 16,
        borderBottom: "1px solid #222",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#111"
      }}>
        <h4 style={{
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <FileCode className="h-4 w-4 text-green-500" />
          Code Preview
        </h4>
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            size="sm"
            onClick={handleOpenPlayground}
            style={{
              background: "#22c55e",
              border: "none",
              color: "#000",
              fontWeight: "600"
            }}
          >
            <Play className="h-3 w-3 mr-1" />
            Playground
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#fff"
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#fff"
            }}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div style={{
        flex: 1,
        overflow: "hidden"
      }}>
        <Editor
          height="100%"
          defaultLanguage="typescript" // CashScript looks similar to TS/Solidity
          value={code || "// Drag blocks to generate Bitcoin Cash code"}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: "none",
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            }
          }}
        />
      </div>

      <div style={{
        padding: 16,
        borderTop: "1px solid #222",
        background: "#111"
      }}>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownloadXml}
          style={{
            width: "100%",
            background: "#1a1a1a",
            border: "1px solid #333",
            color: "#fff"
          }}
        >
          Export Workspace XML
        </Button>
      </div>
    </div>
  )
}
