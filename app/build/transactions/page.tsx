"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FlowBuilder } from "@/components/flow-builder"
import { TerminalBuild } from "@/components/terminalbuild"
import { toast } from "@/hooks/use-toast"
import { Play, Download, Trash2 } from "lucide-react"
import { WalletPanel } from "@/components/wallet-panel"
import { WalletButton } from "@/components/wallet-button"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { generateCode } from "@/lib/code-generator"

interface BCHWallet {
  address: string
  cashaddr: string
  balance: number
  privateKeyWif: string
  mnemonic: string
  derivationPath: string
  transactions: any[]
  bchPrice: number
}

export default function TransactionsPage() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState("")
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [showWallet, setShowWallet] = useState(false)
  const [wallet, setWallet] = useState<BCHWallet | null>(null)

  const handleRun = async () => {
    setTerminalOutput("")
    setIsTerminalOpen(true)

    let logs = "[INFO] Starting Bitcoin Cash flow execution...\n"
    setTerminalOutput(logs)

    toast({
      title: "Running Flow",
      description: "Your Bitcoin Cash flow is being executed...",
      duration: 3000,
    })

    const generatedCode = generateCode(nodes, edges)

    const originalConsoleLog = console.log
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    console.log = (...args) => {
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(" ")
      logs += `[LOG] ${msg}\n`
      setTerminalOutput(logs)
      originalConsoleLog.apply(console, args)
    }

    console.error = (...args) => {
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(" ")
      logs += `[ERROR] ${msg}\n`
      setTerminalOutput(logs)
      originalConsoleError.apply(console, args)
    }

    console.warn = (...args) => {
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(" ")
      logs += `[WARN] ${msg}\n`
      setTerminalOutput(logs)
      originalConsoleWarn.apply(console, args)
    }

    try {
      logs += "[INFO] Loading mainnet-js library...\n"
      setTerminalOutput(logs)

      const mainnetJs = await import("mainnet-js")
      const { TestNetWallet, Wallet } = mainnetJs

      logs += "[INFO] Bitcoin Cash library loaded successfully!\n"
      setTerminalOutput(logs)

      // Get wallet from localStorage
      const savedWallet = localStorage.getItem("bch-wallet")
      if (!savedWallet) {
        throw new Error("No wallet found. Please create a wallet first.")
      }

      const parsedWallet = JSON.parse(savedWallet)
      if (!parsedWallet.privateKeyWif) {
        throw new Error("Invalid wallet data. Please recreate your wallet.")
      }

      logs += "[INFO] Recreating wallet from stored credentials...\n"
      setTerminalOutput(logs)

      const bchWallet = await TestNetWallet.fromWIF(parsedWallet.privateKeyWif)

      logs += `[INFO] Wallet address: ${bchWallet.cashaddr}\n`
      setTerminalOutput(logs)

      logs += "[INFO] Fetching current balance...\n"
      setTerminalOutput(logs)

      const balance = await bchWallet.getBalance()

      logs += `[INFO] Current balance: ${balance.bch} BCH (${balance.sat} satoshis)\n`
      logs += `[INFO] USD value: $${balance.usd?.toFixed(2) || 'N/A'}\n`
      logs += "-----------------------------------\n"
      setTerminalOutput(logs)

      // Process nodes
      for (const node of nodes) {
        if (node.type === 'payment' && node.data.config.receiver) {
          const { receiver, amount } = node.data.config
          logs += `[INFO] Processing payment: ${amount} BCH to ${receiver}\n`
          setTerminalOutput(logs)

          if (balance.sat < amount * 100000000) {
            logs += `[WARN] Insufficient balance for this transaction\n`
            setTerminalOutput(logs)
            continue
          }

          try {
            const txData = await bchWallet.send([
              {
                cashaddr: receiver,
                value: amount,
                unit: 'bch',
              }
            ])
            logs += `[SUCCESS] Transaction sent! TxID: ${txData.txId}\n`
            logs += `[INFO] New balance: ${txData.balance.bch} BCH\n`
            setTerminalOutput(logs)
          } catch (txError: any) {
            logs += `[ERROR] Transaction failed: ${txError.message}\n`
            setTerminalOutput(logs)
          }
        }

        if (node.type === 'opReturn' && node.data.config.message) {
          const { message } = node.data.config
          logs += `[INFO] Sending OP_RETURN message: "${message}"\n`
          setTerminalOutput(logs)

          try {
            const txData = await bchWallet.send([
              ["OP_RETURN", message]
            ])
            logs += `[SUCCESS] OP_RETURN sent! TxID: ${txData.txId}\n`
            setTerminalOutput(logs)
          } catch (txError: any) {
            logs += `[ERROR] OP_RETURN failed: ${txError.message}\n`
            setTerminalOutput(logs)
          }
        }
      }

      logs += "-----------------------------------\n"
      logs += "[SUCCESS] Flow execution completed!\n"
      setTerminalOutput(logs)

      toast({
        title: "Flow Execution Complete",
        description: "Check terminal for output.",
        duration: 3000,
      })
    } catch (error: any) {
      logs += "-----------------------------------\n"
      logs += `[ERROR] Execution failed: ${error.message}\n`
      if (error.stack) {
        logs += `[ERROR] Stack trace:\n${error.stack}\n`
      }
      logs += "-----------------------------------\n"
      setTerminalOutput(logs)

      toast({
        title: "Flow Execution Failed",
        description: error.message,
        duration: 5000,
        variant: "destructive",
      })
    } finally {
      console.log = originalConsoleLog
      console.error = originalConsoleError
      console.warn = originalConsoleWarn
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
      <div className="h-9 flex items-center justify-between px-4 text-sm border-b flex-shrink-0" style={{ backgroundColor: "var(--sidebar-color)", borderColor: "var(--border-color)" }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28ca42]"></div>
          </div>
          <span className="font-medium" style={{ color: "var(--text-color)" }}>CashLabs - BCH Transactions</span>
        </div>
        <div className="flex items-center gap-2">
          <WalletButton
            onWalletChange={setWallet}
            onTogglePanel={() => setShowWallet(!showWallet)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="px-4 py-2 border-b flex items-center justify-center gap-8" style={{ backgroundColor: "var(--sidebar-color)", borderColor: "var(--border-color)" }}>
          <div className="flex items-center gap-2">
            <Button onClick={handleRun} className="font-semibold px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Run Flow
            </Button>
            <Button
              onClick={() => {
                const generatedCode = generateCode(nodes, edges)
                const dataBlob = new Blob([generatedCode], { type: "text/javascript" })
                const url = URL.createObjectURL(dataBlob)
                const link = document.createElement("a")
                link.href = url
                link.download = `bch-script-${Date.now()}.js`
                link.click()
                URL.revokeObjectURL(url)
                toast({
                  title: "Code Exported",
                  description: "Your Bitcoin Cash script has been exported as a .js file",
                  duration: 3000,
                })
              }}
              size="sm"
              style={{ backgroundColor: "var(--button-color)", color: "var(--text-color)" }}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                if (selectedNode) {
                  setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
                  setEdges((eds) =>
                    eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id),
                  )
                  setSelectedNode(null)
                  toast({
                    title: "Node Deleted",
                    description: "Selected node has been removed",
                    duration: 2000,
                  })
                } else {
                  toast({
                    title: "No Node Selected",
                    description: "Please select a node to delete",
                    duration: 2000,
                  })
                }
              }}
              size="sm"
              style={{ backgroundColor: "var(--button-color)", color: "var(--text-color)" }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <PanelGroup direction="horizontal" className="flex-1">
          <Panel defaultSize={showWallet && wallet ? 75 : 100} minSize={30}>
            <FlowBuilder
              type="transaction"
              key="transaction"
              onFlowChange={(newNodes, newEdges) => {
                setNodes(newNodes)
                setEdges(newEdges)
              }}
              onNodeSelect={setSelectedNode}
            />
          </Panel>
          {showWallet && wallet && (
            <>
              <PanelResizeHandle className="w-1 bg-[var(--border-color)] hover:bg-green-500 transition-colors" />
              <Panel defaultSize={25} minSize={15} maxSize={50}>
                <WalletPanel wallet={wallet} onClose={() => setShowWallet(false)} />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>



      <TerminalBuild isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} output={terminalOutput} />
    </div>
  )
}
