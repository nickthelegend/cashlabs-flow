"use client"

import { motion } from "framer-motion"
import { Shield, Coins, Users, Lock, Zap, ArrowRight, RefreshCw, Layers } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const workflows = [
    {
        id: "private-mixer",
        title: "Private Mixer Pro",
        description: "Fragment UTXOs and shuffle outputs through multiple hops to break on-chain traceability.",
        icon: Shield,
        color: "text-green-500",
        bg: "bg-green-500/10",
        tags: ["Privacy", "Advanced"],
        link: "/workflow/private-mixer"
    },
    {
        id: "token-airdrop",
        title: "Bulk Token Airdrop",
        description: "Distribute CashTokens or BCH to hundreds of addresses at once with optimized fee batching.",
        icon: Users,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        tags: ["Marketing", "Batch"],
        link: "/workflow/token-airdrop"
    },
    {
        id: "stealth-payment",
        title: "Stealth Pay",
        description: "Send a payment that is split into random chunks and sent over several delayed steps.",
        icon: Lock,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        tags: ["Privacy", "Security"],
        link: "/workflow/stealth-pay"
    },
    {
        id: "dust-collector",
        title: "Dust Collector",
        description: "Sweep hundreds of tiny UTXOs into a single clean address to save on future transaction fees.",
        icon: RefreshCw,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        tags: ["Utility", "Optimization"],
        link: "/workflow/dust-collector"
    }
]

export default function WorkflowsPage() {
    return (
        <div className="min-h-screen bg-black text-white py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 italic uppercase">
                        Workflows Gallery
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Ready-to-use Bitcoin Cash blueprints. Drag-and-drop logic for every scenario, from privacy to bulk distributions.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {workflows.map((wf, i) => (
                        <motion.div
                            key={wf.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="group relative p-8 rounded-3xl bg-[#0a0a0a] border border-gray-900 hover:border-green-500/30 transition-all overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className={`p-4 ${wf.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                                    <wf.icon className={`w-8 h-8 ${wf.color}`} />
                                </div>
                                <div className="flex gap-2">
                                    {wf.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 rounded-full bg-white/5 text-[8px] font-bold uppercase tracking-widest text-gray-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-3 italic tracking-tight">{wf.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                {wf.description}
                            </p>

                            <Link href={wf.link}>
                                <Button className="w-full bg-white hover:bg-gray-200 text-black font-bold rounded-xl flex items-center justify-between px-6 h-12">
                                    Launch Workflow
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>

                            {/* Decorative background element */}
                            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-green-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 p-12 rounded-[3.5rem] bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/20 text-center"
                >
                    <Zap className="w-12 h-12 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4 italic">CREATE YOUR OWN</h2>
                    <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm">
                        Can't find what you need? Build a custom workflow from scratch in our transaction laboratory.
                    </p>
                    <Link href="/build/transactions">
                        <Button variant="outline" className="border-green-500/30 text-green-500 hover:bg-green-500/10 h-14 px-10 rounded-2xl font-bold text-lg">
                            Open Laboratory
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
