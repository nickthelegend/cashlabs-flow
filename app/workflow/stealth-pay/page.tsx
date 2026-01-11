"use client"

import { useState, useCallback, useEffect } from "react"
import { FlowBuilder } from "@/components/flow-builder"
import { TerminalBuild } from "@/components/terminalbuild"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Lock, Play, ArrowLeft, Download, EyeOff, ShieldCheck } from "lucide-react"
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

export default function StealthPayWorkflow() {
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
                data: { label: "PRIVATE SOURCE", nodeType: "account", config: {} }
            },
            {
                id: "split-node",
                type: "splitUTXO",
                position: { x: 300, y: 150 },
                data: { label: "FRAGMENT AMOUNT", nodeType: "splitUTXO", config: { count: 5 } }
            },
            {
                id: "delay-node",
                type: "delay",
                position: { x: 550, y: 150 },
                data: { label: "TIME OBFUSCATION", nodeType: "delay", config: { seconds: 3600 } }
            },
            {
                id: "payment-node",
                type: "payment",
                position: { x: 800, y: 150 },
                data: { label: "STEALTH SEND", nodeType: "payment", config: {} }
            }
        ]

        const initialEdges: Edge[] = [
            { id: "e1", source: "source-wallet", target: "split-node", animated: true },
            { id: "e2", source: "split-node", target: "delay-node", animated: true },
            { id: "e3", source: "delay-node", target: "payment-node", animated: true },
        ]

        setNodes(initialNodes)
        setEdges(initialEdges)
    }, [setNodes, setEdges])

    const handleRun = async () => {
        setIsTerminalOpen(true)
        let logs = "[INFO] Initializing Stealth Payment obfuscation...\n"
        setTerminalOutput(logs)

        await new Promise(r => setTimeout(r, 1000))
        logs += "[INFO] Step 1: Breaking payment into 5 random prime-numbered fragments.\n"
        setTerminalOutput(logs)

        await new Promise(r => setTimeout(r, 1500))
        logs += "[INFO] Step 2: Scheduling asynchronous broadcast across multiple time-bins.\n"
        setTerminalOutput(logs)

        await new Promise(r => setTimeout(r, 2000))
        logs += "[SUCCESS] Stealth sequence initiated. Funds will arrive at the destination address sporadically over the next hour.\n"
        setTerminalOutput(logs)

        toast({
            title: "Stealth Sequence Started",
            description: "Payment is being tunneled through time obfuscation layers.",
        })
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
                        <Lock className="w-4 h-4 text-purple-500" />
                        <h1 className="font-bold text-sm tracking-tight italic uppercase">Stealth Pay</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <WalletButton onWalletChange={setWallet} onTogglePanel={() => setShowWallet(!showWallet)} />
                    <Button onClick={handleRun} className="bg-purple-600 hover:bg-purple-700 text-white font-bold h-9 px-6 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                        <EyeOff className="w-4 h-4 mr-2" /> Initiate Stealth
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
                            <PanelResizeHandle className="w-1 bg-gray-900 hover:bg-purple-500 transition-colors" />
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
