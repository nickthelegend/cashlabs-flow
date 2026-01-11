"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  type NodeTypes,
  type Node,
  type Connection,
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
import { type Edge } from "@xyflow/react"


interface FlowBuilderProps {
  type: "transaction"
  onFlowChange?: (nodes: Node[], edges: Edge[]) => void
  onNodeSelect?: (node: Node | null) => void
}

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

export function FlowBuilder({ type, onFlowChange, onNodeSelect }: FlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  )

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

      // Get the position relative to the ReactFlow canvas
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      if (!position) return

      let config = getDefaultConfig(nodeType)
      if (nodeType === "account") {
        const savedWallet = localStorage.getItem("bch-wallet")
        if (savedWallet) {
          try {
            const parsedWallet = JSON.parse(savedWallet)
            if (parsedWallet && parsedWallet.privateKeyWif) {
              config = { ...config, wif: parsedWallet.privateKeyWif }
            }
          } catch (error) {
            console.error("Error parsing wallet from localStorage:", error)
          }
        }
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

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes],
  )

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    onNodeSelect?.(node)
  }, [onNodeSelect])

  const onUpdateNode = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) => nds.map((node) => (node.id === nodeId ? { ...node, data } : node)))
    },
    [setNodes],
  )



  // Initialize with BCH example nodes
  useEffect(() => {
    const transactionNodes: Node[] = [
      {
        id: "tx-example-1",
        type: "account",
        position: { x: 400, y: 100 },
        data: {
          label: "BCH WALLET",
          nodeType: "account",
          config: { wif: null },
        },
      },
      {
        id: "tx-example-2",
        type: "payment",
        position: { x: 650, y: 100 },
        data: {
          label: "SEND BCH",
          nodeType: "payment",
          config: { amount: 0.001, receiver: null },
        },
      },
    ]

    const initialNodes = transactionNodes
    setNodes(initialNodes)
  }, [type, setNodes])

  useEffect(() => {
    if (onFlowChange) {
      onFlowChange(nodes, edges)
    }
  }, [nodes, edges, onFlowChange])

  return (
    <div className="h-full w-full relative flex overflow-hidden">
      <NodeSidebar type={type} />
      <div className="flex-1 overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          snapGrid={snapGrid}
          defaultViewport={defaultViewport}
          fitView
          style={{ background: "#000000" }}
          connectionLineStyle={{ stroke: "#22c55e", strokeWidth: 2 }}
          defaultEdgeOptions={{ style: { stroke: "#22c55e", strokeWidth: 2 }, animated: true }}
        >
          <Controls className="bg-gray-900 border-gray-700" />
          <MiniMap
            className="bg-gray-900 border-gray-700"
            nodeStrokeColor={(n) => {
              if (n.type === "account") return "#0ea5e9"
              if (n.type === "payment") return "#22c55e"
              if (n.type === "tokenTransfer") return "#a855f7"
              if (n.type === "tokenCreate") return "#eab308"
              return "#6B7280"
            }}
            nodeColor={(n) => {
              if (n.type === "account") return "#0ea5e9"
              if (n.type === "payment") return "#22c55e"
              if (n.type === "tokenTransfer") return "#a855f7"
              if (n.type === "tokenCreate") return "#eab308"
              return "#6B7280"
            }}
            maskColor="rgba(0, 0, 0, 0.8)"
          />
          <Background color="#374151" gap={20} size={1} />
        </ReactFlow>
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
