"use client"

import { useState, useCallback, useEffect } from "react"
import { FlowBuilder } from "@/components/flow-builder"
import { TerminalBuild } from "@/components/terminalbuild"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Shield, Play, ArrowLeft, Download, RefreshCw, Lock } from "lucide-react"
import Link from "next/link"
import {
    useNodesState,
    useEdgesState,
    addEdge,
    type Node,
    type Edge,
    type Connection
} from "@xyflow/react"

export default function PrivateMixerWorkflow() {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
    const [isTerminalOpen, setIsTerminalOpen] = useState(false)
    const [terminalOutput, setTerminalOutput] = useState("")

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        [setEdges],
    )

    useEffect(() => {
        // Initial Private Mixer Workflow
        const initialNodes: Node[] = [
            {
                id: "source-wallet",
                type: "account",
                position: { x: 50, y: 150 },
                data: { label: "SOURCE WALLET", nodeType: "account", config: {} }
            },
            {
                id: "split-node",
                type: "splitUTXO",
                position: { x: 300, y: 150 },
                data: { label: "SPLIT INPUTS", nodeType: "splitUTXO", config: { count: 8, amountPerOutput: 0.0005 } }
            },
            {
                id: "shuffle-node",
                type: "shuffleOutputs",
                position: { x: 550, y: 150 },
                data: { label: "RANDOMIZE", nodeType: "shuffleOutputs", config: {} }
            },
            {
                id: "pool-node",
                type: "mixPoolJoin",
                position: { x: 800, y: 150 },
                data: { label: "MIX POOL", nodeType: "mixPoolJoin", config: { pool: "Global High Privacy" } }
            },
            {
                id: "remix-node",
                type: "autoRemix",
                position: { x: 1050, y: 150 },
                data: { label: "AUTO REMIX", nodeType: "autoRemix", config: { target: 3 } }
            },
            {
                id: "output-node",
                type: "output",
                position: { x: 1300, y: 150 },
                data: { label: "VERIFY ANON", nodeType: "output", config: {} }
            }
        ]

        const initialEdges: Edge[] = [
            { id: "e1-2", source: "source-wallet", target: "split-node", animated: true },
            { id: "e2-3", source: "split-node", target: "shuffle-node", animated: true },
            { id: "e3-4", source: "shuffle-node", target: "pool-node", animated: true },
            { id: "e4-5", source: "pool-node", target: "remix-node", animated: true },
            { id: "e5-6", source: "remix-node", target: "output-node", animated: true },
        ]

        setNodes(initialNodes)
        setEdges(initialEdges)
    }, [setNodes, setEdges])

    const handleRun = async () => {
        setIsTerminalOpen(true)
        setTerminalOutput("[INFO] Initializing Private Mixer workflow...\n")

        // Simulate complex mixing logic for visual feedback
        let logs = "[INFO] Loading anonymization engine...\n"
        setTerminalOutput(logs)

        await new Promise(r => setTimeout(r, 1000))
        logs += "[INFO] Step 1: Splitting UTXOs into 8 unique fingerprints...\n"
        setTerminalOutput(logs)

        await new Promise(r => setTimeout(r, 1500))
        logs += "[INFO] Step 2: Shuffling output indices to break deterministic links...\n"
        setTerminalOutput(logs)

        await new Promise(r => setTimeout(r, 1500))
        logs += "[MIX] Joining collaborative round with 4 other peers...\n"
        setTerminalOutput(logs)

        await new Promise(r => setTimeout(r, 2000))
        logs += "[SUCCESS] Round complete. Anonymity set increased.\n"
        logs += "[INFO] Step 3: Initiating Auto-Remix (3 rounds target)...\n"
        setTerminalOutput(logs)

        for (let i = 1; i <= 3; i++) {
            await new Promise(r => setTimeout(r, 1000))
            logs += ` - Remix Round ${i} successful.\n`
            setTerminalOutput(logs)
        }

        logs += "[SUCCESS] Private mixer flow complete. Your transactions are now untraceable.\n"
        setTerminalOutput(logs)

        toast({
            title: "Mixer Execution Complete",
            description: "Transaction chain has been anonymized successfully.",
        })
    }

    return (
        <div className="h-screen w-screen flex flex-col bg-[#050505] text-white">
            <header className="h-14 border-b border-gray-900 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/build">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-500/10 rounded-lg">
                            <Shield className="w-4 h-4 text-green-500" />
                        </div>
                        <h1 className="font-bold text-sm tracking-tight">Private Mixer Workflow</h1>
                        <Badge className="bg-green-500/10 text-green-500 border-none text-[8px] px-1.5">EXPERIMENTAL</Badge>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="border-gray-800 text-gray-400">
                        <Lock className="w-3.5 h-3.5 mr-2" /> Stealth Mode
                    </Button>
                    <Button onClick={handleRun} className="bg-green-600 hover:bg-green-700 text-black font-bold h-9">
                        <RefreshCw className="w-4 h-4 mr-2" /> Start Mix
                    </Button>
                </div>
            </header>

            <main className="flex-1 relative">
                <FlowBuilder
                    type="transaction"
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                />

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8 px-8 py-3 bg-black/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl pointer-events-none">
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] text-gray-500 uppercase font-black">Entropy</span>
                        <span className="text-green-500 font-mono text-sm uppercase">Ultra High</span>
                    </div>
                    <div className="w-[1px] h-6 bg-gray-800" />
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] text-gray-500 uppercase font-black">Remixing</span>
                        <span className="text-white font-mono text-sm uppercase">Active</span>
                    </div>
                    <div className="w-[1px] h-6 bg-gray-800" />
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] text-gray-500 uppercase font-black">Peers</span>
                        <span className="text-green-500 font-mono text-sm uppercase">12 Available</span>
                    </div>
                </div>
            </main>

            <TerminalBuild isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} output={terminalOutput} />
        </div>
    )
}

function Badge({ children, className }: any) {
    return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>{children}</span>
}
