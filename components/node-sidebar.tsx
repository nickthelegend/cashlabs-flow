"use client"

import type React from "react"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Search,
  Wallet,
  Send,
  PlusSquare,
  ArrowRightLeft,
  FileText,
  Coins,
  Clock,
  GitBranch,
  Monitor,
  Zap,
  ChevronRight
} from "lucide-react"

interface NodeSidebarProps {
  type: "transaction"
  onNodeClick?: (type: string) => void
}

const bchNodes = [
  {
    id: "account",
    label: "BCH WALLET",
    description: "Connect or create a Bitcoin Cash wallet",
    icon: Wallet,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    category: "Core",
    isNew: true,
  },
  {
    id: "payment",
    label: "SEND BCH",
    description: "Send Bitcoin Cash to any address",
    icon: Send,
    color: "text-green-400",
    bg: "bg-green-400/10",
    category: "Transaction",
    isNew: false,
  },
  {
    id: "tokenCreate",
    label: "CREATE TOKEN",
    description: "Launch a new CashToken (Fungible or NFT)",
    icon: PlusSquare,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    category: "CashTokens",
    isNew: true,
  },
  {
    id: "tokenTransfer",
    label: "TRANSFER TOKEN",
    description: "Transfer existing CashTokens",
    icon: ArrowRightLeft,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    category: "CashTokens",
    isNew: false,
  },
  {
    id: "opReturn",
    label: "OP_RETURN",
    description: "Embed data or messages into the blockchain",
    icon: FileText,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    category: "Transaction",
    isNew: false,
  },
  {
    id: "getBalance",
    label: "GET BALANCE",
    description: "Fetch the current balance of a wallet",
    icon: Coins,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    category: "Utility",
    isNew: false,
  },
  {
    id: "waitForBalance",
    label: "WAIT FOR BALANCE",
    description: "Pause flow until a specific balance is reached",
    icon: Clock,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    category: "Utility",
    isNew: false,
  },
  {
    id: "condition",
    label: "CONDITION",
    description: "Add if/else branching logic to your flow",
    icon: GitBranch,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    category: "Logic",
    isNew: false,
  },
  {
    id: "executeTxn",
    label: "EXECUTE",
    description: "Finalize and broadcast the transaction",
    icon: Zap,
    color: "text-red-400",
    bg: "bg-red-400/10",
    category: "Core",
    isNew: true,
  }
]

export function NodeSidebar({ type, onNodeClick }: NodeSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNodes = bchNodes.filter(node =>
    node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.setData("application/reactflow-label", nodeLabel)
    event.dataTransfer.effectAllowed = "move"
  }

  const groupedNodes = filteredNodes.reduce(
    (acc, node) => {
      const category = node.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(node)
      return acc
    },
    {} as Record<string, typeof bchNodes>,
  )

  return (
    <div className="w-[320px] h-full bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col overflow-hidden shadow-2xl">
      <div className="p-6 pb-4">
        <h2 className="text-white text-lg font-bold flex items-center gap-2">
          <Search className="w-4 h-4 text-green-500" />
          Add Tile
        </h2>
        <p className="text-gray-500 text-xs mt-1">Click or drag to add to your flow</p>
      </div>

      <div className="px-6 pb-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-green-500 transition-colors" />
          <Input
            placeholder="Search tiles..."
            className="pl-9 bg-[#1a1a1a] border-none text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-green-500/50 h-10 rounded-lg text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 pb-6 space-y-6">
          {Object.entries(groupedNodes).map(([category, nodes]) => (
            <div key={category} className="space-y-3">
              <div className="px-2 flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em]">{category} ({nodes.length})</h4>
              </div>
              <div className="space-y-1">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="group relative flex items-start gap-4 p-3 rounded-xl hover:bg-[#1a1a1a] cursor-pointer transition-all duration-200 border border-transparent hover:border-[#2a2a2a]"
                    draggable
                    onDragStart={(event) => onDragStart(event, node.id, node.label)}
                    onClick={() => onNodeClick?.(node.id)}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 ${node.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <node.icon className={`w-5 h-5 ${node.color}`} />
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-semibold truncate">{node.label}</span>
                        {node.isNew && (
                          <span className="px-1.5 py-0.5 rounded-[4px] bg-purple-600 text-[8px] font-bold text-white uppercase tracking-wider">NEW</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                        {node.description}
                      </p>
                    </div>

                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-700 group-hover:text-green-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groupedNodes).length === 0 && (
            <div className="py-20 text-center">
              <Search className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No tiles found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

