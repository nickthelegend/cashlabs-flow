"use client"

import type React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface NodeSidebarProps {
  type: "transaction"
}

const bchNodes = [
  {
    id: "account",
    label: "BCH WALLET",
    description: "Bitcoin Cash wallet",
    color: "bg-blue-600",
    category: "Core",
  },
  {
    id: "payment",
    label: "SEND BCH",
    description: "Send Bitcoin Cash",
    color: "bg-green-600",
    category: "Transaction",
  },
  {
    id: "tokenCreate",
    label: "CREATE TOKEN",
    description: "Create CashToken",
    color: "bg-yellow-600",
    category: "CashTokens",
  },
  {
    id: "tokenTransfer",
    label: "TRANSFER TOKEN",
    description: "Send CashTokens",
    color: "bg-purple-600",
    category: "CashTokens",
  },
  {
    id: "opReturn",
    label: "OP_RETURN",
    description: "Store data on-chain",
    color: "bg-orange-600",
    category: "Transaction",
  },
  {
    id: "getBalance",
    label: "GET BALANCE",
    description: "Check wallet balance",
    color: "bg-cyan-600",
    category: "Utility",
  },
  {
    id: "waitForBalance",
    label: "WAIT FOR BALANCE",
    description: "Wait for funds",
    color: "bg-violet-600",
    category: "Utility",
  },
  {
    id: "condition",
    label: "CONDITION",
    description: "If/else logic",
    color: "bg-teal-600",
    category: "Logic",
  },
  {
    id: "output",
    label: "OUTPUT",
    description: "Display results",
    color: "bg-gray-600",
    category: "Utility",
  },
]

const transactionNodes = bchNodes.filter((node) =>
  ["Core", "Transaction", "CashTokens", "Logic", "Utility"].includes(node.category),
)

export function NodeSidebar({ type }: NodeSidebarProps) {
  const nodes = transactionNodes

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.setData("application/reactflow-label", nodeLabel)
    event.dataTransfer.effectAllowed = "move"
  }

  const groupedNodes = nodes.reduce(
    (acc, node) => {
      if (!acc[node.category]) {
        acc[node.category] = []
      }
      acc[node.category].push(node)
      return acc
    },
    {} as Record<string, typeof nodes>,
  )

  return (
    <div className="w-64 h-full bg-gray-900/95 backdrop-blur-lg border-r border-gray-700 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white text-lg font-semibold">
            Transaction Builder
          </h2>
        </div>
        <p className="text-gray-400 text-sm">
          Create Bitcoin Cash transactions visually
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-sm font-semibold">BCH Nodes</h3>
            <Badge variant="secondary" className="text-xs bg-green-600/20 text-green-400">
              Bitcoin Cash
            </Badge>
          </div>
        </div>

        <ScrollArea className="flex-1 h-full">
          <div className="p-4 space-y-4">
            {Object.entries(groupedNodes).map(([category, categoryNodes]) => (
              <div key={category}>
                <h4 className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wide">{category}</h4>
                <div className="space-y-2">
                  {categoryNodes.map((node) => (
                    <div
                      key={node.id}
                      className={`${node.color} p-3 rounded-lg cursor-grab active:cursor-grabbing hover:opacity-80 transition-all duration-200 hover:scale-105`}
                      draggable
                      onDragStart={(event) => onDragStart(event, node.id, node.label)}
                    >
                      <div className="text-white font-semibold text-sm">{node.label}</div>
                      <div className="text-white/70 text-xs mt-1">{node.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
