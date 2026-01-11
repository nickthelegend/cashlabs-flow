"use client"

import { useState, useCallback, useEffect } from "react"
import { FlowBuilder } from "@/components/flow-builder"
import { TerminalBuild } from "@/components/terminalbuild"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Eye, Play, ArrowLeft, Monitor, Zap } from "lucide-react"
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

export default function WatchtowerWorkflow() {
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
                id: "watch-node",
                type: "watchAddress",
                position: { x: 50, y: 150 },
                data: { label: "MONITOR ADDRESS", nodeType: "watchAddress", config: {} }
            },
            {
                id: "wait-node",
                type: "waitForBalance",
                position: { x: 300, y: 150 },
                data: { label: "EVENT TRIGGER", nodeType: "waitForBalance", config: { targetBalance: 0.01 } }
            },
            {
                id: "action-node",
                type: "payment",
                position: { x: 550, y: 150 },
                data: { label: "AUTO RESPONDER", nodeType: "payment", config: {} }
            },
            {
                id: "output-node",
                type: "output",
                position: { x: 800, y: 150 },
                data: { label: "SECURITY LOG", nodeType: "output", config: {} }
            }
        ]

        const initialEdges: Edge[] = [
            { id: "e1", source: "watch-node", target: "wait-node", animated: true },
            { id: "e2", source: "wait-node", target: "action-node", animated: true },
            { id: "e3", source: "action-node", target: "output-node", animated: true },
        ]

        setNodes(initialNodes)
        setEdges(initialEdges)
    }, [setNodes, setEdges])

    const handleRun = async () => {
        setIsTerminalOpen(true)
        let logs = "[INFO] Activating Watchtower Monitoring Service...\n"
        setTerminalOutput(logs)

        try {
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 1] Connecting to blockchain websocket for real-time events...\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 2] Monitoring target address: bitcoincash:qr...\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[INFO] Watchtower is now LIVE. Standing by for incoming UTXOs...\n"
            await new Promise(r => setTimeout(r, 2000))
            logs += "[EVENT] Balance change detected! Triggering auto-responder flow...\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[SUCCESS] Auto-payment executed to cold storage. Security maintained.\n"
            setTerminalOutput(logs)

            toast({
                title: "Watchtower Triggered",
                description: "Automated security action performed.",
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
                        <Eye className="w-4 h-4 text-cyan-500" />
                        <h1 className="font-bold text-sm tracking-tight italic uppercase">Watchtower Monitor</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <WalletButton onWalletChange={setWallet} onTogglePanel={() => setShowWallet(!showWallet)} />
                    <Button onClick={handleRun} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-9 px-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        <Zap className="w-4 h-4 mr-2" /> Activate Watcher
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
                            <PanelResizeHandle className="w-1 bg-gray-900 hover:bg-cyan-500 transition-colors" />
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
