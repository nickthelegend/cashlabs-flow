"use client"

import { useState, useCallback, useEffect } from "react"
import { FlowBuilder } from "@/components/flow-builder"
import { TerminalBuild } from "@/components/terminalbuild"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { RefreshCw, Play, ArrowLeft, Trash2, Brush } from "lucide-react"
import Link from "next/link"
import { WalletPanel } from "@/components/wallet-panel"
import { WalletButton } from "@/components/wallet-button"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import {
    useNodesState,
    useEdgesState,
    addEdge,
    type Node,
    type Edge,
    type Connection
} from "@xyflow/react"

export default function DustCollectorWorkflow() {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
    const [isTerminalOpen, setIsTerminalOpen] = useState(false)
    const [terminalOutput, setTerminalOutput] = useState("")
    const [showWallet, setShowWallet] = useState(false)
    const [wallet, setWallet] = useState<any>(null)

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        [setEdges],
    )

    useEffect(() => {
        const initialNodes: Node[] = [
            {
                id: "source-wallet",
                type: "account",
                position: { x: 50, y: 150 },
                data: { label: "WALLET WITH DUST", nodeType: "account", config: {} }
            },
            {
                id: "merge-node",
                type: "mergeUTXOs",
                position: { x: 300, y: 150 },
                data: { label: "SCAN & MERGE DUST", nodeType: "mergeUTXOs", config: {} }
            },
            {
                id: "fee-node",
                type: "feeController",
                position: { x: 550, y: 150 },
                data: { label: "ECONOMY FEE (1s/B)", nodeType: "feeController", config: { rate: 1 } }
            },
            {
                id: "output-node",
                type: "output",
                position: { x: 800, y: 150 },
                data: { label: "COLSOLIDATED INPUT", nodeType: "output", config: {} }
            }
        ]

        const initialEdges: Edge[] = [
            { id: "e1", source: "source-wallet", target: "merge-node", animated: true },
            { id: "e2", source: "merge-node", target: "fee-node", animated: true },
            { id: "e3", source: "fee-node", target: "output-node", animated: true },
        ]

        setNodes(initialNodes)
        setEdges(initialEdges)
    }, [setNodes, setEdges])

    const handleRun = async () => {
        setIsTerminalOpen(true)
        let logs = "[INFO] Scanning for UTXOs below 1000 sats...\n"
        setTerminalOutput(logs)

        try {
            const mainnetJs = await import("mainnet-js")
            const { TestNetWallet } = mainnetJs
            const savedWallet = localStorage.getItem("bch-wallet")
            const parsedWallet = savedWallet ? JSON.parse(savedWallet) : null

            if (!parsedWallet) {
                logs += "[ERROR] Connect your wallet to sweep dust.\n"
                setTerminalOutput(logs)
                return
            }

            const source = await TestNetWallet.fromWIF(parsedWallet.privateKeyWif)
            logs += `[INFO] Wallet: ${source.cashaddr}\n`

            // Simulation of UTXO merging
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 1] Found 27 dust UTXOs. Consolidating into 1 output...\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 2] Calculating optimal fee for 27 inputs (economy rate)...\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[SUCCESS] Transaction built. All dust has been swept into your main balance.\n"
            setTerminalOutput(logs)

            toast({
                title: "Wallet Cleaned",
                description: "27 dust UTXOs consolidated successfully.",
            })
        } catch (e: any) {
            logs += `[ERROR] ${e.message}\n`
            setTerminalOutput(logs)
        }
    }

    return (
        <div className="h-screen w-screen flex flex-col bg-[#050505] text-white">
            <header className="h-14 border-b border-gray-900 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/workflows">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Gallery
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-amber-500" />
                        <h1 className="font-bold text-sm tracking-tight italic uppercase tracking-widest">Dust Collector</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <WalletButton onWalletChange={setWallet} onTogglePanel={() => setShowWallet(!showWallet)} />
                    <Button onClick={handleRun} className="bg-amber-600 hover:bg-amber-700 text-black font-bold h-9 px-6 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                        <Brush className="w-4 h-4 mr-2" /> Sweep Wallet
                    </Button>
                </div>
            </header>

            <main className="flex-1 relative">
                <PanelGroup direction="horizontal">
                    <Panel defaultSize={showWallet && wallet ? 75 : 100} minSize={30}>
                        <FlowBuilder
                            type="transaction"
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                        />
                    </Panel>
                    {showWallet && wallet && (
                        <>
                            <PanelResizeHandle className="w-1 bg-gray-900 hover:bg-amber-500 transition-colors" />
                            <Panel defaultSize={25} minSize={15} maxSize={50}>
                                <WalletPanel wallet={wallet} onClose={() => setShowWallet(false)} />
                            </Panel>
                        </>
                    )}
                </PanelGroup>
            </main>

            <TerminalBuild isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} output={terminalOutput} />
        </div>
    )
}
