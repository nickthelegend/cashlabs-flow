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
  ChevronRight,
  TrendingUp,
  Clock3,
  Flame,
  UserPlus,
  Hammer,
  Image as ImageIcon,
  Users,
  List,
  Download
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
    id: "prepareWallet",
    label: "PREPARE WALLET",
    description: "Fix 'vout=0' error for Token Genesis",
    icon: Hammer,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
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
  },
  {
    id: "multiSend",
    label: "MULTI-SEND",
    description: "Send BCH to multiple addresses at once",
    icon: UserPlus,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    category: "Transaction",
    isNew: true,
  },
  {
    id: "tokenCreate",
    label: "CREATE TOKEN (NFT)",
    description: "Create a new CashToken or NFT collection",
    icon: PlusSquare,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    category: "Token",
  },
  {
    id: "imageUpload",
    label: "NFT IMAGE",
    description: "Upload and preview NFT artwork",
    icon: ImageIcon,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    category: "Token",
    isNew: true,
  },
  {
    id: "tokenMint",
    label: "MINT TOKEN",
    description: "Mint additional supply of an existing token",
    icon: PlusSquare,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    category: "Token",
    isNew: true,
  },
  {
    id: "tokenTransfer",
    label: "TRANSFER TOKEN",
    description: "Send CashTokens to another address",
    icon: ArrowRightLeft,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    category: "Token",
  },
  {
    id: "tokenBurn",
    label: "BURN TOKEN",
    description: "Permanently destroy CashTokens",
    icon: Flame,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    category: "Token",
    isNew: true,
  },
  {
    id: "assetList",
    label: "FETCH ASSETS",
    description: "Get all tokens held in the wallet",
    icon: List,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    category: "Analytics",
    isNew: true,
  },
  {
    id: "tokenHolders",
    label: "TOKEN HOLDERS",
    description: "Fetch holders list and export to CSV",
    icon: Users,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    category: "Analytics",
    isNew: true,
  },
  {
    id: "opReturn",
    label: "OP_RETURN",
    description: "Embed data permanently into the blockchain",
    icon: FileText,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    category: "Core",
  },
  {
    id: "priceFeed",
    label: "PRICE FEED",
    description: "Get real-time BCH market prices",
    icon: TrendingUp,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    category: "Utility",
    isNew: true,
  },
  {
    id: "delay",
    label: "DELAY",
    description: "Wait for a specified time between steps",
    icon: Clock3,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    category: "Utility",
    isNew: true,
  },
  {
    id: "output",
    label: "OUTPUT HOLDINGS",
    description: "Show wallet holdings in a nice panel",
    icon: Monitor,
    color: "text-gray-400",
    bg: "bg-gray-400/10",
    category: "Utility",
    isNew: true,
  },
  {
    id: "executeTxn",
    label: "EXECUTE",
    description: "Broadcast the built transaction",
    icon: Zap,
    color: "text-red-400",
    bg: "bg-red-400/10",
    category: "Core",
  },
]

export function NodeSidebar({ type, onNodeClick }: NodeSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.setData("application/reactflow-label", nodeLabel)
    event.dataTransfer.effectAllowed = "move"
  }

  const nodes = bchNodes.filter(
    (node) =>
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const groupedNodes = nodes.reduce(
    (acc, node) => {
      if (!acc[node.category]) {
        acc[node.category] = []
      }
      acc[node.category].push(node)
      return acc
    },
    {} as Record<string, typeof bchNodes>,
  )

  return (
    <div className="w-[260px] h-full bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col overflow-hidden shadow-2xl">
      <div className="p-4 pb-2">
        <h2 className="text-white text-base font-bold flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-green-500" />
          Add Tile
        </h2>
        <p className="text-gray-500 text-[10px] mt-0.5">Click or drag to your flow</p>
      </div>

      <div className="px-4 pb-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
          <Input
            placeholder="Search tiles..."
            className="pl-8 bg-[#1a1a1a] border-none text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-green-500/50 h-8 rounded-lg text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 pb-6 space-y-6">
          {Object.entries(groupedNodes).map(([category, nodes]) => (
            <div key={category} className="space-y-2">
              <div className="px-2">
                <h4 className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.1em]">{category}</h4>
              </div>
              <div className="space-y-1">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="group relative flex items-start gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition-all duration-200 border border-transparent hover:border-[#2a2a2a]"
                    draggable
                    onDragStart={(event) => onDragStart(event, node.id, node.label)}
                    onClick={() => onNodeClick?.(node.id)}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 ${node.bg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <node.icon className={`w-4 h-4 ${node.color}`} />
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-xs font-semibold truncate">{node.label}</span>
                        {node.isNew && (
                          <span className="px-1 py-0.5 rounded-[3px] bg-purple-600 text-[7px] font-bold text-white uppercase">NEW</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-[10px] mt-0.5 line-clamp-1">
                        {node.description}
                      </p>
                    </div>

                    <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-700 group-hover:text-green-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
