"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { FlowBuilder } from "@/components/flow-builder"
import { TerminalBuild } from "@/components/terminalbuild"
import { toast } from "@/hooks/use-toast"
import { Play, Download, Trash2 } from "lucide-react"
import { WalletPanel } from "@/components/wallet-panel"
import { WalletButton } from "@/components/wallet-button"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { generateCode } from "@/lib/code-generator"
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection
} from "@xyflow/react"

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
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showWallet, setShowWallet] = useState(false)
  const [wallet, setWallet] = useState<BCHWallet | null>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  )

  // Initialize with BCH example nodes
  useEffect(() => {
    const initialNodes: Node[] = [
      {
        id: "tx-example-1",
        type: "account",
        position: { x: 400, y: 100 },
        data: {
          label: "BCH WALLET",
          nodeType: "account",
          config: { wif: null },
        },
      },
      {
        id: "tx-example-2",
        type: "payment",
        position: { x: 650, y: 100 },
        data: {
          label: "SEND BCH",
          nodeType: "payment",
          config: { amount: 0.001, receiver: null },
        },
      },
    ]
    setNodes(initialNodes)
  }, [setNodes])

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

    const originalConsoleLog = console.log
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    console.log = (...args) => {
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(" ")
      logs += `[LOG] ${msg}\n`
      setTerminalOutput(logs)
      originalConsoleLog.apply(console, args)
    }

    try {
      logs += "[INFO] Loading mainnet-js library...\n"
      setTerminalOutput(logs)

      const mainnetJs = await import("mainnet-js")
      const { TestNetWallet } = mainnetJs

      logs += "[INFO] Bitcoin Cash library loaded successfully!\n"
      setTerminalOutput(logs)

      const savedWallet = localStorage.getItem("bch-wallet")
      const parsedWallet = savedWallet ? JSON.parse(savedWallet) : null
      const wallets = new Map<string, any>()

      // Pass 1: Initialize all wallets
      for (const node of nodes) {
        if (node.type === 'account') {
          const wif = (node.data as any).config?.wif || parsedWallet?.privateKeyWif
          if (!wif) {
            logs += `[WARN] Wallet node ${node.data.label} has no WIF. Skipping.\n`
            continue
          }
          logs += `[INFO] Initializing wallet from node: ${node.data.label}\n`
          const w = await TestNetWallet.fromWIF(wif)
          wallets.set(node.id, w)
          const bal = await w.getBalance()
          logs += `[INFO] Address: ${w.cashaddr} | Balance: ${bal.bch} BCH\n`
          setTerminalOutput(logs)
        }
      }

      const defaultWallet = Array.from(wallets.values())[0] || (parsedWallet?.privateKeyWif ? await TestNetWallet.fromWIF(parsedWallet.privateKeyWif) : null)

      if (!defaultWallet) {
        throw new Error("No wallet available. Please add a BCH WALLET node or create a wallet.")
      }

      logs += "-----------------------------------\n"
      setTerminalOutput(logs)

      const getSourceNode = (targetId: string) => {
        const edge = edges.find(e => e.target === targetId)
        return edge ? nodes.find(n => n.id === edge.source) : null
      }

      // Pass 2: Execution
      for (const node of nodes) {
        if (node.type === 'payment') {
          const config = (node.data as any).config
          const { receiver, amount } = config
          if (!receiver || !amount) {
            logs += `[WARN] Skipping payment node: Missing receiver address or amount.\n`
            continue
          }

          const sourceNode = getSourceNode(node.id)
          const senderWallet = (sourceNode && wallets.get(sourceNode.id)) || defaultWallet

          logs += `[INFO] Sending ${amount} BCH to ${receiver}...\n`
          setTerminalOutput(logs)

          try {
            const txData = await senderWallet.send([
              { cashaddr: receiver, value: amount, unit: 'bch' }
            ])
            logs += `[SUCCESS] Transaction sent! TxID: ${txData.txId}\n`
            logs += `[INFO] Remaining balance: ${txData.balance.bch} BCH\n`
          } catch (e: any) {
            logs += `[ERROR] Send failed: ${e.message}\n`
          }
          setTerminalOutput(logs)
        }

        if (node.type === 'opReturn') {
          const config = (node.data as any).config
          const { message } = config
          if (!message) continue

          const sourceNode = getSourceNode(node.id)
          const senderWallet = (sourceNode && wallets.get(sourceNode.id)) || defaultWallet

          logs += `[INFO] Sending OP_RETURN: "${message}"\n`
          setTerminalOutput(logs)

          try {
            const txData = await senderWallet.send([["OP_RETURN", message]])
            logs += `[SUCCESS] Sent! TxID: ${txData.txId}\n`
          } catch (e: any) {
            logs += `[ERROR] OP_RETURN failed: ${e.message}\n`
          }
          setTerminalOutput(logs)
        }

        if (node.type === 'getBalance') {
          const sourceNode = getSourceNode(node.id)
          const walletNode = (sourceNode && wallets.get(sourceNode.id)) || defaultWallet
          logs += `[INFO] Fetching balance for ${walletNode.cashaddr.substring(0, 15)}...\n`
          const bal = await walletNode.getBalance()
          logs += `[INFO] Balance: ${bal.bch} BCH ($${bal.usd?.toFixed(2)})\n`
          setTerminalOutput(logs)
        }

        if (node.type === 'waitForBalance') {
          const config = (node.data as any).config
          const target = config.targetBalance || 0.0001
          const sourceNode = getSourceNode(node.id)
          const walletNode = (sourceNode && wallets.get(sourceNode.id)) || defaultWallet
          logs += `[INFO] Waiting for balance to reach ${target} BCH...\n`
          setTerminalOutput(logs)
          const bal = await walletNode.waitForBalance(target, 'bch')
          logs += `[SUCCESS] Target reached! New balance: ${bal}\n`
          setTerminalOutput(logs)
        }

        if (node.type === 'tokenTransfer') {
          const config = (node.data as any).config
          const { tokenId, amount, receiver } = config
          if (!tokenId || !amount || !receiver) continue

          const sourceNode = getSourceNode(node.id)
          const walletNode = (sourceNode && wallets.get(sourceNode.id)) || defaultWallet

          logs += `[INFO] Transferring ${amount} tokens to ${receiver}...\n`
          setTerminalOutput(logs)

          try {
            const txData = await walletNode.send([
              { cashaddr: receiver, value: 1000, unit: 'sat' },
              { tokenId: tokenId, amount: BigInt(amount) }
            ])
            logs += `[SUCCESS] Tokens sent! TxID: ${txData.txId}\n`
          } catch (e: any) {
            logs += `[ERROR] Token transfer failed: ${e.message}\n`
          }
          setTerminalOutput(logs)
        }
      }

      logs += "-----------------------------------\n"
      logs += "[SUCCESS] Flow execution completed!\n"
      setTerminalOutput(logs)

      toast({
        title: "Flow Execution Complete",
        description: "Transactions processed successfully.",
        duration: 3000,
      })
    } catch (error: any) {
      logs += "-----------------------------------\n"
      logs += `[ERROR] Execution failed: ${error.message}\n`
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
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ backgroundColor: "#000", color: "#fff" }}>
      <div className="h-9 flex items-center justify-between px-4 text-sm border-b border-[#1a1a1a] bg-[#0d0d0d] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28ca42]"></div>
          </div>
          <span className="font-medium text-gray-400">CashLabs - BCH Transactions</span>
        </div>
        <div className="flex items-center gap-2">
          <WalletButton
            onWalletChange={setWallet}
            onTogglePanel={() => setShowWallet(!showWallet)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="px-4 py-2 border-b border-[#1a1a1a] flex items-center justify-center gap-8 bg-[#0d0d0d]">
          <div className="flex items-center gap-2">
            <Button onClick={handleRun} className="font-semibold px-4 py-2 bg-green-500 hover:bg-green-600 text-black rounded transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]" size="sm">
              <Play className="h-4 w-4 mr-2 fill-black" />
              Run Flow
            </Button>
            <Button
              onClick={() => {
                const code = generateCode(nodes, edges)
                const dataBlob = new Blob([code], { type: "text/javascript" })
                const url = URL.createObjectURL(dataBlob)
                const link = document.createElement("a")
                link.href = url
                link.download = `bch-script-${Date.now()}.js`
                link.click()
                URL.revokeObjectURL(url)
              }}
              size="sm"
              variant="outline"
              className="border-[#1a1a1a] bg-transparent text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                if (selectedNode) {
                  onNodesChange([{ type: 'remove', id: selectedNode.id }])
                  setSelectedNode(null)
                  toast({
                    title: "Node Deleted",
                    description: "Selected node has been removed",
                    duration: 2000,
                  })
                }
              }}
              size="sm"
              variant="outline"
              className="border-[#1a1a1a] bg-transparent text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <PanelGroup direction="horizontal" className="flex-1">
          <Panel defaultSize={showWallet && wallet ? 75 : 100} minSize={30}>
            <FlowBuilder
              type="transaction"
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeSelect={setSelectedNode}
              onCloseOverlays={() => setIsTerminalOpen(false)}
            />
          </Panel>
          {showWallet && wallet && (
            <>
              <PanelResizeHandle className="w-1 bg-[#1a1a1a] hover:bg-green-500 transition-colors" />
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
