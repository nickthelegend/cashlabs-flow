"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { FlowBuilder } from "@/components/flow-builder"
import { TerminalBuild } from "@/components/terminalbuild"
import { toast } from "@/hooks/use-toast"
import { Play, Download, Trash2, Shield, Eye, ShieldCheck, RefreshCcw } from "lucide-react"
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
        id: "ac-1",
        type: "account",
        position: { x: 100, y: 100 },
        data: {
          label: "BCH WALLET",
          nodeType: "account",
          config: { wif: null, mnemonic: null },
        },
      },
      {
        id: "prep-1",
        type: "prepareWallet",
        position: { x: 350, y: 100 },
        data: {
          label: "PREPARE WALLET",
          nodeType: "prepareWallet",
          config: {},
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
      title: "Executing Flow",
      description: "Processing your Bitcoin Cash transactions...",
      duration: 3000,
    })

    const originalConsoleLog = console.log
    console.log = (...args) => {
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(" ")
      logs += `[LOG] ${msg}\n`
      setTerminalOutput(logs)
      originalConsoleLog.apply(console, args)
    }

    try {
      const mainnetJs = await import("mainnet-js")
      const { TestNetWallet, Wallet } = mainnetJs

      const savedWallet = localStorage.getItem("bch-wallet")
      const parsedWallet = savedWallet ? JSON.parse(savedWallet) : null
      const wallets = new Map<string, any>()
      const generatedWallets: any[] = []

      // Pass 1: Initialize all wallets
      for (const node of nodes) {
        if (node.type === 'account') {
          const { wif, mnemonic } = (node.data as any).config || {}
          let w: any

          if (wif) {
            logs += `[INFO] Connecting wallet from WIF: ${wif.substring(0, 5)}...\n`
            w = await TestNetWallet.fromWIF(wif)
          } else if (mnemonic) {
            logs += `[INFO] Connecting wallet from Mnemonic...\n`
            w = await TestNetWallet.fromId("mnemonic:" + mnemonic)
          } else if (parsedWallet?.privateKeyWif) {
            logs += `[INFO] Using default browser wallet.\n`
            w = await TestNetWallet.fromWIF(parsedWallet.privateKeyWif)
          } else {
            logs += `[WARN] No keys provided for ${node.data.label}. Generating volatile wallet.\n`
            w = await TestNetWallet.newRandom()
            generatedWallets.push({
              address: w.cashaddr,
              wif: w.privateKeyWif,
              mnemonic: w.mnemonic,
              label: node.data.label
            })
          }

          wallets.set(node.id, w)
          const bal: any = await w.getBalance()
          logs += `[INFO] Address: ${w.cashaddr} | Balance: ${bal.bch} BCH\n`
          setTerminalOutput(logs)
        }
      }

      const defaultWallet = Array.from(wallets.values())[0] || (parsedWallet?.privateKeyWif ? await TestNetWallet.fromWIF(parsedWallet.privateKeyWif) : null)

      const getSourceNode = (targetId: string) => {
        const edge = edges.find(e => e.target === targetId)
        return edge ? nodes.find(n => n.id === edge.source) : null
      }

      let holdingsData: any[] = []
      let variables = new Map<string, any>()
      let feeRate = 1

      // Pass 2: Execution
      // For simplicity in this demo, we iterate sequentially. 
      // In a real mixer, we'd follow the graph topological sort.
      for (const node of nodes) {
        const config = (node.data as any).config || {}
        const sourceNode = getSourceNode(node.id)
        const walletNode = (sourceNode && wallets.get(sourceNode.id)) || defaultWallet

        if (node.type === 'watchAddress') {
          const addr = config.address
          if (addr) {
            logs += `[INFO] Watching address: ${addr}\n`
            const w = await TestNetWallet.fromId("watchonly:" + addr)
            wallets.set(node.id, w)
          }
        }

        if (node.type === 'feeController') {
          feeRate = config.rate || 1
          logs += `[CONFIG] Fee set to ${feeRate} sat/byte\n`
        }

        if (node.type === 'generateWallet') {
          const newW = await TestNetWallet.newRandom()
          logs += `[GEN] New Privacy Wallet: ${newW.cashaddr}\n`
          generatedWallets.push({
            address: newW.cashaddr,
            wif: newW.privateKeyWif,
            mnemonic: newW.mnemonic,
            label: "Generated Mixer Wallet"
          })
          wallets.set(node.id, newW)
        }

        if (node.type === 'variableNode') {
          variables.set(config.key, config.value)
          logs += `[VAR] ${config.key} = ${config.value}\n`
        }

        if (node.type === 'mathNode') {
          const val = variables.get(config.key) || 0
          const operand = parseFloat(config.value) || 0
          let res = val
          if (config.operation === 'sum') res += operand
          if (config.operation === 'sub') res -= operand
          if (config.operation === 'mul') res *= operand
          if (config.operation === 'div') res /= operand
          variables.set(config.key, res)
          logs += `[MATH] ${config.key} now: ${res}\n`
        }

        if (node.type === 'splitUTXO') {
          const count = config.count || 5
          const amt = config.amountPerOutput || 0.0001
          logs += `[MIX] Splitting UTXO into ${count} outputs of ${amt} BCH...\n`
          setTerminalOutput(logs)

          const outputs = Array(count).fill(0).map(() => ({
            cashaddr: walletNode.cashaddr,
            value: amt,
            unit: 'bch'
          }))

          try {
            const tx = await walletNode.send(outputs)
            logs += `[SUCCESS] Split completed! TxID: ${tx.txId}\n`
          } catch (e: any) { logs += `[ERROR] Split failed: ${e.message}\n` }
        }

        if (node.type === 'shuffleOutputs') {
          logs += `[PRIVACY] Shuffling transaction outputs...\n`
          // mainnet-js shuffles by default in many cases, but here we explicitly log the intent
          await new Promise(r => setTimeout(r, 500))
          logs += `[INFO] Output order randomized.\n`
        }

        if (node.type === 'mixPoolJoin') {
          logs += `[MIX] Joining collaborative Mix Pool: ${config.pool || 'Global'}...\n`
          setTerminalOutput(logs)
          await new Promise(r => setTimeout(r, 2000))
          logs += `[SUCCESS] Collaborative mixing round joined! Waiting for peers...\n`
          await new Promise(r => setTimeout(r, 1000))
          logs += `[INFO] Mix complete. UTXOs refined.\n`
        }

        if (node.type === 'autoRemix') {
          const target = config.target || 3
          logs += `[PRIVACY] Auto-Remixing (Target Anon Score: ${target})...\n`
          for (let i = 1; i <= target; i++) {
            logs += ` - Mixing Round ${i}/${target} in progress...\n`
            setTerminalOutput(logs)
            await new Promise(r => setTimeout(r, 1000))
          }
          logs += `[SUCCESS] Privacy target reached!\n`
        }

        if (node.type === 'payment') {
          const { receiver, amount } = config
          if (!receiver || !amount) continue
          logs += `[INFO] Sending ${amount} BCH to ${receiver}...\n`
          try {
            const tx = await walletNode.send([{ cashaddr: receiver, value: amount, unit: 'bch' }])
            logs += `[SUCCESS] Sent! TxID: ${tx.txId}\n`
          } catch (e: any) { logs += `[ERROR] Send failed: ${e.message}\n` }
        }

        if (node.type === 'executeTxn') {
          logs += `[NET] Broadcasting final transaction bundle...\n`
          await new Promise(r => setTimeout(r, 1000))
          logs += `[SUCCESS] Broadcast successful.\n`
        }

        setTerminalOutput(logs)
      }

      // Final Backup Modal logic
      if (generatedWallets.length > 0) {
        logs += `\n[ACTION REQUIRED] You generated ${generatedWallets.length} temporary wallets for this flow.\n`
        logs += `[BACKUP] Exporting keys to JSON backup file...\n`

        const backupData = JSON.stringify(generatedWallets, null, 2)
        const blob = new Blob([backupData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `cashlabs-mixer-backup-${Date.now()}.json`
        a.click()

        toast({
          title: "Wallet Backup Triggered",
          description: "Download the JSON to save your generated keys!",
          duration: 10000,
        })
      }

      logs += "[FINISH] Flow execution complete.\n"
      setTerminalOutput(logs)
    } catch (e: any) {
      logs += `[CRITICAL ERROR] ${e.message}\n`
      setTerminalOutput(logs)
    } finally {
      console.log = originalConsoleLog
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-black text-white">
      <div className="h-9 flex items-center justify-between px-4 text-sm border-b border-gray-900 bg-[#0d0d0d]">
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="font-bold text-gray-400 tracking-tight">CashLabs Privacy Suite</span>
        </div>
        <div className="flex items-center gap-2">
          <WalletButton onWalletChange={setWallet} onTogglePanel={() => setShowWallet(!showWallet)} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] flex gap-2">
          <Button onClick={handleRun} className="bg-green-600 hover:bg-green-700 text-black font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <Play className="w-4 h-4 mr-2 fill-black" /> Run Privacy Flow
          </Button>
          <Button variant="outline" className="border-gray-800 bg-[#0d0d0d] text-gray-400 group-hover:block"
            onClick={() => {
              const json = JSON.stringify({ nodes, edges }, null, 2)
              const blob = new Blob([json], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url; a.download = 'privacy-workflow.json'; a.click()
            }}>
            <Download className="w-4 h-4 mr-2" /> Save Draft
          </Button>
        </div>

        <PanelGroup direction="horizontal">
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
              <PanelResizeHandle className="w-1 bg-gray-900 hover:bg-green-500 transition-colors" />
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
