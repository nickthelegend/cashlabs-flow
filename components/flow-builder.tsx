"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  type NodeTypes,
  type Node,
  type Connection,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { NodeSidebar } from "./node-sidebar"
import {
  AccountNode,
  PaymentNode,
  TokenTransferNode,
  TokenCreateNode,
  OpReturnNode,
  GetBalanceNode,
  WaitForBalanceNode,
  ConditionNode,
  OutputNode,
  ExecuteTxnNode,
} from "./nodes/bch-nodes"
import { NodePropertiesPanel } from "./node-properties-panel"
import {
  Plus,
  MousePointer2,
  Hand,
  Search,
  Maximize2,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Send,
  PlusSquare,
  ArrowRightLeft,
  FileText,
  Zap,
  Trash2
} from "lucide-react"

interface FlowBuilderProps {
  type: "transaction"
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  onNodeSelect?: (node: Node | null) => void
  onCloseOverlays?: () => void
}

const nodeData = [
  { id: "account", label: "BCH WALLET", icon: Wallet, color: "text-blue-400" },
  { id: "payment", label: "SEND BCH", icon: Send, color: "text-green-400" },
  { id: "tokenCreate", label: "CREATE TOKEN", icon: PlusSquare, color: "text-yellow-400" },
  { id: "tokenTransfer", label: "TRANSFER TOKEN", icon: ArrowRightLeft, color: "text-purple-400" },
  { id: "opReturn", label: "OP_RETURN", icon: FileText, color: "text-orange-400" },
  { id: "executeTxn", label: "EXECUTE", icon: Zap, color: "text-red-400" },
]

const snapGrid: [number, number] = [20, 20]
const defaultViewport = { x: 0, y: 0, zoom: 1 }

const nodeTypes: NodeTypes = {
  account: AccountNode,
  payment: PaymentNode,
  tokenTransfer: TokenTransferNode,
  tokenCreate: TokenCreateNode,
  opReturn: OpReturnNode,
  getBalance: GetBalanceNode,
  waitForBalance: WaitForBalanceNode,
  condition: ConditionNode,
  output: OutputNode,
  executeTxn: ExecuteTxnNode,
}

export function FlowBuilder({
  type,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeSelect,
  onCloseOverlays
}: FlowBuilderProps) {
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, nodeId?: string } | null>(null)

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const nodeType = event.dataTransfer.getData("application/reactflow")
      const nodeLabel = event.dataTransfer.getData("application/reactflow-label")

      if (typeof nodeType === "undefined" || !nodeType) {
        return
      }

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      if (!position) return

      let config = getDefaultConfig(nodeType)
      const savedWallet = localStorage.getItem("bch-wallet")
      if (nodeType === "account" && savedWallet) {
        try {
          const parsedWallet = JSON.parse(savedWallet)
          if (parsedWallet?.privateKeyWif) {
            config = { ...config, wif: parsedWallet.privateKeyWif }
          }
        } catch (e) { }
      }

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: nodeLabel || nodeType.toUpperCase(),
          nodeType: nodeType,
          config: config,
        },
      }

      onNodesChange([{ type: 'add', item: newNode }])
    },
    [reactFlowInstance, onNodesChange],
  )

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    onNodeSelect?.(node)
    setIsSidebarOpen(false)
    onCloseOverlays?.()
  }, [onNodeSelect, onCloseOverlays])

  const onUpdateNode = useCallback(
    (nodeId: string, data: any) => {
      onNodesChange([{ type: 'replace', id: nodeId, item: { ...nodes.find(n => n.id === nodeId), data } as Node }])
    },
    [nodes, onNodesChange],
  )

  const onPaneContextMenu = useCallback((event: any) => {
    event.preventDefault()
    setContextMenu({ x: event.clientX, y: event.clientY })
  }, [])

  const onNodeContextMenu = useCallback((event: any, node: Node) => {
    event.preventDefault()
    setContextMenu({ x: event.clientX, y: event.clientY, nodeId: node.id })
  }, [])

  const onPaneClick = useCallback((event: any) => {
    setContextMenu(null)
  }, [])

  const deleteNode = useCallback((nodeId: string) => {
    onNodesChange([{ type: 'remove', id: nodeId }])
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
      onNodeSelect?.(null)
    }
    setContextMenu(null)
  }, [selectedNode, onNodesChange, onNodeSelect])

  const addNodeAtPosition = useCallback((type: string, x: number, y: number) => {
    const position = reactFlowInstance?.screenToFlowPosition({ x, y })
    if (!position) return

    const nodeLabel = nodeData.find(n => n.id === type)?.label || type.toUpperCase()
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: type,
      position,
      data: {
        label: nodeLabel,
        nodeType: type,
        config: getDefaultConfig(type),
      },
    }
    onNodesChange([{ type: 'add', item: newNode }])
    setContextMenu(null)
  }, [reactFlowInstance, onNodesChange])

  return (
    <div className="h-full w-full relative flex overflow-hidden bg-black">
      {/* Narrow Sidebar Toolbar */}
      <div className="w-16 h-full bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col items-center py-6 gap-6 z-50">
        <div className="p-2 bg-green-500 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <LayoutGrid className="w-5 h-5 text-black" />
        </div>

        <div className="w-8 h-[1px] bg-gray-800" />

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2 rounded-lg transition-all ${isSidebarOpen ? 'bg-gray-800 text-green-500' : 'text-gray-500 hover:text-white hover:bg-gray-900'}`}
        >
          <Plus className="w-5 h-5" />
        </button>

        <button className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition-all">
          <MousePointer2 className="w-5 h-5" />
        </button>

        <button className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition-all">
          <Hand className="w-5 h-5" />
        </button>

        <button className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition-all">
          <Search className="w-5 h-5" />
        </button>

        <div className="mt-auto flex flex-col gap-4 pb-4">
          <button className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition-all">
            <Maximize2 className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition-all">
            <LayoutGrid className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Main Sidebar (Add Tile) */}
      <div
        className={`transition-all duration-300 ease-in-out h-full ${isSidebarOpen ? 'w-[320px] opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full'}`}
      >
        <NodeSidebar
          type={type}
          onNodeClick={(nodeType) => {
            const viewport = reactFlowInstance?.getViewport()
            if (viewport) {
              addNodeAtPosition(nodeType, window.innerWidth / 2, window.innerHeight / 2)
            }
          }}
        />
      </div>

      <div className="flex-1 overflow-hidden relative group">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneContextMenu={onPaneContextMenu}
          onNodeContextMenu={onNodeContextMenu}
          onPaneClick={onPaneClick}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          snapGrid={snapGrid}
          defaultViewport={defaultViewport}
          fitView
          style={{ background: "#050505" }}
          connectionLineStyle={{ stroke: "#22c55e", strokeWidth: 2 }}
          defaultEdgeOptions={{ style: { stroke: "#22c55e", strokeWidth: 2 }, animated: true }}
        >
          <Controls className="bg-[#0d0d0d] border-[#1a1a1a] text-white shadow-2xl fill-white" />
          <MiniMap
            className="bg-[#0d0d0d] border-[#1a1a1a] rounded-lg shadow-2xl"
            nodeStrokeColor={(n) => {
              if (n.type === "account") return "#0ea5e9"
              if (n.type === "payment") return "#22c55e"
              if (n.type === "tokenTransfer") return "#a855f7"
              if (n.type === "tokenCreate") return "#eab308"
              return "#6B7280"
            }}
            nodeColor={(n) => {
              if (n.type === "account") return "rgba(14, 165, 233, 0.2)"
              if (n.type === "payment") return "rgba(34, 197, 94, 0.2)"
              if (n.type === "tokenTransfer") return "rgba(168, 85, 247, 0.2)"
              if (n.type === "tokenCreate") return "rgba(234, 179, 8, 0.2)"
              return "#1a1a1a"
            }}
            maskColor="rgba(0, 0, 0, 0.9)"
          />
          <Background color="#1a1a1a" gap={20} size={1} />
        </ReactFlow>

        {/* Right Click Context Menu */}
        {contextMenu && (
          <div
            className="fixed z-[100] w-64 bg-[#111111] border border-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {contextMenu.nodeId ? (
              <>
                <div className="p-3 border-b border-[#1a1a1a] flex items-center justify-between bg-[#161616]">
                  <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Node Actions</span>
                  <Trash2 className="w-3 h-3 text-red-400" />
                </div>
                <div className="p-1">
                  <button
                    className="w-full flex items-center gap-3 p-2.5 hover:bg-red-500/10 rounded-lg group transition-all text-left"
                    onClick={() => deleteNode(contextMenu.nodeId!)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-red-400 text-sm font-medium">Delete Node</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 border-b border-[#1a1a1a] flex items-center justify-between bg-[#161616]">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Connect Node</span>
                  <Plus className="w-3 h-3 text-gray-500" />
                </div>
                <div className="p-1">
                  {nodeData.map((node) => (
                    <button
                      key={node.id}
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-green-500/10 rounded-lg group transition-all text-left"
                      onClick={() => addNodeAtPosition(node.id, contextMenu.x, contextMenu.y)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center group-hover:scale-110 group-hover:bg-green-500/20 transition-all">
                        <node.icon className={`w-4 h-4 ${node.color}`} />
                      </div>
                      <span className="text-gray-300 text-sm font-medium group-hover:text-white">{node.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {selectedNode && (
        <NodePropertiesPanel
          selectedNode={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdateNode={onUpdateNode}
        />
      )}
    </div>
  )
}

function getDefaultConfig(nodeType: string) {
  const configs: Record<string, any> = {
    account: { wif: null, address: null },
    payment: { amount: 0.001, receiver: null },
    tokenTransfer: { tokenId: null, amount: 1, receiver: null },
    tokenCreate: { amount: 1000000, commitment: "", capability: "none" },
    opReturn: { message: "Hello BCH!" },
    getBalance: {},
    waitForBalance: { targetBalance: 0.001 },
    condition: { condition: "balance", operator: ">", value: 0 },
    output: { format: "JSON" },
    executeTxn: { network: "TestNet" },
  }
  return configs[nodeType] || {}
}
