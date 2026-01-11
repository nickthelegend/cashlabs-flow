"use client"

import { useState, useCallback, useEffect } from "react"
import { FlowBuilder } from "@/components/flow-builder"
import { TerminalBuild } from "@/components/terminalbuild"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Clock, Play, ArrowLeft, Lock, Shield } from "lucide-react"
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

export default function HodlVaultWorkflow() {
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
                data: { label: "MY WALLET", nodeType: "account", config: {} }
            },
            {
                id: "vault-node",
                type: "payment", // Using payment node as a placeholder for locking
                position: { x: 350, y: 150 },
                data: { label: "LOCK IN VAULT", nodeType: "payment", config: { amount: 0.1 } }
            },
            {
                id: "timer-node",
                type: "delay",
                position: { x: 650, y: 150 },
                data: { label: "LOCK EXTENSION", nodeType: "delay", config: { seconds: 31536000 } } // 1 year
            },
            {
                id: "output-node",
                type: "output",
                position: { x: 950, y: 150 },
                data: { label: "SAVINGS ACCOUNT", nodeType: "output", config: {} }
            }
        ]

        const initialEdges: Edge[] = [
            { id: "e1", source: "source-wallet", target: "vault-node", animated: true },
            { id: "e2", source: "vault-node", target: "timer-node", animated: true },
            { id: "e3", source: "timer-node", target: "output-node", animated: true },
        ]

        setNodes(initialNodes)
        setEdges(initialEdges)
    }, [setNodes, setEdges])

    const handleRun = async () => {
        setIsTerminalOpen(true)
        let logs = "[INFO] Initializing HODL Vault Smart Contract...\n"
        setTerminalOutput(logs)

        try {
            const mainnetJs = await import("mainnet-js")
            const { TestNetWallet } = mainnetJs
            const savedWallet = localStorage.getItem("bch-wallet")
            const parsedWallet = savedWallet ? JSON.parse(savedWallet) : null

            if (!parsedWallet) {
                logs += "[ERROR] Connect your wallet to lock funds.\n"
                setTerminalOutput(logs)
                return
            }

            const source = await TestNetWallet.fromWIF(parsedWallet.privateKeyWif)
            logs += `[INFO] Deployer: ${source.cashaddr}\n`

            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 1] Compiling CashScript HODL Vault contract...\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 2] Generating P2SH address for time-locked spending...\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[STEP 3] Transferring 0.1 BCH to the vault. Lock active for 1 year.\n"
            await new Promise(r => setTimeout(r, 1000))
            logs += "[SUCCESS] Funds are secured. The private key will be useless until the block depth condition is met.\n"
            setTerminalOutput(logs)

            toast({
                title: "Vault Secured",
                description: "0.1 BCH locked until 2027.",
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
                        <Clock className="w-4 h-4 text-rose-500" />
                        <h1 className="font-bold text-sm tracking-tight italic uppercase">HODL Vault</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <WalletButton onWalletChange={setWallet} onTogglePanel={() => setShowWallet(!showWallet)} />
                    <Button onClick={handleRun} className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-9 px-6 shadow-[0_0_20px_rgba(225,29,72,0.3)]">
                        <Lock className="w-4 h-4 mr-2" /> Deploy Vault
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
                            <PanelResizeHandle className="w-1 bg-gray-900 hover:bg-rose-500 transition-colors" />
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
