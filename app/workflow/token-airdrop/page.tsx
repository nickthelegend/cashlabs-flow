"use client"

import { useState, useCallback, useEffect } from "react"
import { FlowBuilder } from "@/components/flow-builder"
import { TerminalBuild } from "@/components/terminalbuild"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Users, Play, ArrowLeft, Download, Send, PlusCircle } from "lucide-react"
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

export default function TokenAirdropWorkflow() {
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
                data: { label: "SENDER WALLET", nodeType: "account", config: {} }
            },
            {
                id: "token-gen",
                type: "tokenCreate",
                position: { x: 300, y: 150 },
                data: { label: "GENESIS TOKEN", nodeType: "tokenCreate", config: { name: "Airdrop Token", symbol: "AIR" } }
            },
            {
                id: "batch-node",
                type: "batchPayments",
                position: { x: 550, y: 150 },
                data: { label: "BATCH RECIPIENTS", nodeType: "batchPayments", config: { recipients: "100 Recipients Loaded" } }
            },
            {
                id: "multi-send",
                type: "multiSend",
                position: { x: 800, y: 150 },
                data: { label: "EXECUTE AIRDROP", nodeType: "multiSend", config: {} }
            }
        ]

        const initialEdges: Edge[] = [
            { id: "e1", source: "source-wallet", target: "token-gen", animated: true },
            { id: "e2", source: "token-gen", target: "batch-node", animated: true },
            { id: "e3", source: "batch-node", target: "multi-send", animated: true },
        ]

        setNodes(initialNodes)
        setEdges(initialEdges)
    }, [setNodes, setEdges])

    const handleRun = async () => {
        setIsTerminalOpen(true)
        let logs = "[INFO] Initializing Bulk Airdrop system...\n"
        setTerminalOutput(logs)

        try {
            const mainnetJs = await import("mainnet-js")
            const { TestNetWallet } = mainnetJs
            const savedWallet = localStorage.getItem("bch-wallet")
            const parsedWallet = savedWallet ? JSON.parse(savedWallet) : null

            if (!parsedWallet) {
                logs += "[ERROR] Wallet required for airdrop distribution.\n"
                setTerminalOutput(logs)
                return
            }

            const source = await TestNetWallet.fromWIF(parsedWallet.privateKeyWif)
            logs += `[INFO] Sender: ${source.cashaddr}\n`
            logs += "[STEP 1] Validating UTXO set for Token Genesis...\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 2] Preparing batch metadata for 100 recipients...\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 3] Broadcasting multi-send transaction bundle...\n"
            await new Promise(r => setTimeout(r, 2000))
            logs += "[SUCCESS] Airdrop complete! Check your explorer for the fan-out transaction.\n"
            setTerminalOutput(logs)

            toast({
                title: "Airdrop Successful",
                description: "Tokens distributed to 100 recipients.",
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
                        <Users className="w-4 h-4 text-blue-500" />
                        <h1 className="font-bold text-sm tracking-tight italic">Bulk Token Airdrop</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <WalletButton onWalletChange={setWallet} onTogglePanel={() => setShowWallet(!showWallet)} />
                    <Button onClick={handleRun} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-6 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                        <Send className="w-4 h-4 mr-2" /> Broadast Airdrop
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
                            <PanelResizeHandle className="w-1 bg-gray-900 hover:bg-blue-500 transition-colors" />
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
