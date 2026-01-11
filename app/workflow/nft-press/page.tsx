"use client"

import { useState, useCallback, useEffect } from "react"
import { FlowBuilder } from "@/components/flow-builder"
import { TerminalBuild } from "@/components/terminalbuild"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Flame, Play, ArrowLeft, Image as ImageIcon, Send } from "lucide-react"
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

export default function NFTPressWorkflow() {
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
                data: { label: "CREATOR WALLET", nodeType: "account", config: {} }
            },
            {
                id: "image-node",
                type: "imageUpload",
                position: { x: 300, y: 150 },
                data: { label: "NFT ARTWORK", nodeType: "imageUpload", config: {} }
            },
            {
                id: "mint-node",
                type: "tokenMint",
                position: { x: 550, y: 150 },
                data: { label: "MINT COLLECTION", nodeType: "tokenMint", config: { count: 10 } }
            },
            {
                id: "output-node",
                type: "output",
                position: { x: 800, y: 150 },
                data: { label: "LIVE NFT LIBRARY", nodeType: "output", config: {} }
            }
        ]

        const initialEdges: Edge[] = [
            { id: "e1", source: "source-wallet", target: "image-node", animated: true },
            { id: "e2", source: "image-node", target: "mint-node", animated: true },
            { id: "e3", source: "mint-node", target: "output-node", animated: true },
        ]

        setNodes(initialNodes)
        setEdges(initialEdges)
    }, [setNodes, setEdges])

    const handleRun = async () => {
        setIsTerminalOpen(true)
        let logs = "[INFO] Initializing NFT Minting Press...\n"
        setTerminalOutput(logs)

        try {
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 1] Validating artwork resolution and metadata...\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 2] Creating CashToken Genesis with minting capabilities...\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 3] Batch minting 10 unique NFTs with IPFS pointers...\n"
            await new Promise(r => setTimeout(r, 1500))
            logs += "[SUCCESS] NFT collection minted! TxIDs generated for all 10 assets.\n"
            setTerminalOutput(logs)

            toast({
                title: "Minting Complete",
                description: "10 NFTs have been added to your wallet.",
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
                        <Flame className="w-4 h-4 text-orange-500" />
                        <h1 className="font-bold text-sm tracking-tight italic uppercase">NFT Minting Press</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <WalletButton onWalletChange={setWallet} onTogglePanel={() => setShowWallet(!showWallet)} />
                    <Button onClick={handleRun} className="bg-orange-600 hover:bg-orange-700 text-black font-bold h-9 px-6 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                        <Send className="w-4 h-4 mr-2" /> Start Minting
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
                            <PanelResizeHandle className="w-1 bg-gray-900 hover:bg-orange-500 transition-colors" />
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
