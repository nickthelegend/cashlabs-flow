"use client"

import { useState, useCallback, useEffect } from "react"
import { FlowBuilder } from "@/components/flow-builder"
import { TerminalBuild } from "@/components/terminalbuild"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Landmark, Play, ArrowLeft, Users, ShieldCheck } from "lucide-react"
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

export default function EscrowWorkflow() {
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
                data: { label: "SELLER WALLET", nodeType: "account", config: {} }
            },
            {
                id: "buyer-wallet",
                type: "account",
                position: { x: 50, y: 300 },
                data: { label: "BUYER WALLET", nodeType: "account", config: {} }
            },
            {
                id: "escrow-node",
                type: "multiSend",
                position: { x: 400, y: 225 },
                data: { label: "2-OF-3 ESCROW", nodeType: "multiSend", config: {} }
            },
            {
                id: "output-node",
                type: "output",
                position: { x: 750, y: 225 },
                data: { label: "SETTLED TRADE", nodeType: "output", config: {} }
            }
        ]

        const initialEdges: Edge[] = [
            { id: "e1", source: "source-wallet", target: "escrow-node", animated: true },
            { id: "e2", source: "buyer-wallet", target: "escrow-node", animated: true },
            { id: "e3", source: "escrow-node", target: "output-node", animated: true },
        ]

        setNodes(initialNodes)
        setEdges(initialEdges)
    }, [setNodes, setEdges])

    const handleRun = async () => {
        setIsTerminalOpen(true)
        let logs = "[INFO] Initializing Trustless 2-of-3 Escrow...\n"
        setTerminalOutput(logs)

        try {
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 1] Generating multi-party multisig script...\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 2] Waiting for Buyer to lock funds in the contract...\n"
            await new Promise(r => setTimeout(r, 1500))
            logs += "[INFO] Buyer funds detected: 0.5 BCH locked.\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 3] Arbitration key (Flow Watchtower) initialized as mediator.\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[SUCCESS] Escrow active. Trade can now proceed with cryptographic security.\n"
            setTerminalOutput(logs)

            toast({
                title: "Escrow Finalized",
                description: "2-of-3 Multisig active for 0.5 BCH.",
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
                        <Landmark className="w-4 h-4 text-emerald-500" />
                        <h1 className="font-bold text-sm tracking-tight italic uppercase">Trustless Escrow</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <WalletButton onWalletChange={setWallet} onTogglePanel={() => setShowWallet(!showWallet)} />
                    <Button onClick={handleRun} className="bg-emerald-600 hover:bg-emerald-700 text-black font-bold h-9 px-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <ShieldCheck className="w-4 h-4 mr-2" /> Create Escrow
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
                            <PanelResizeHandle className="w-1 bg-gray-900 hover:bg-emerald-500 transition-colors" />
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
