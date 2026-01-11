"use client"

import { memo } from "react"
import { Handle, Position } from "@xyflow/react"
import { Wallet, Send, Coins, FileCode, CheckCircle, Play, Snowflake, FileText, Clock, Layers, PlusSquare, Zap, TrendingUp, UserPlus, Clock3, Flame, Hammer } from "lucide-react"

const baseNodeStyle = {
  padding: "12px 16px",
  borderRadius: "12px",
  minWidth: "180px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  backdropFilter: "blur(8px)",
}

// BCH Account/Wallet Node
export const AccountNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #0ea5e9, #0284c7)", border: "2px solid #38bdf8" }}>
    <Handle type="source" position={Position.Right} style={{ background: "#38bdf8", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <Wallet className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "BCH WALLET"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Bitcoin Cash Wallet</div>
  </div>
))
AccountNode.displayName = "AccountNode"

// BCH Payment Node
export const PaymentNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #22c55e, #16a34a)", border: "2px solid #4ade80" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#4ade80", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#4ade80", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <Send className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "SEND BCH"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">{data.config?.amount || 0} BCH</div>
  </div>
))
PaymentNode.displayName = "PaymentNode"

// CashToken Create Node
export const TokenCreateNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #eab308, #ca8a04)", border: "2px solid #facc15" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#facc15", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#facc15", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <Coins className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "CREATE TOKEN"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">CashToken Genesis</div>
  </div>
))
TokenCreateNode.displayName = "TokenCreateNode"

// CashToken Transfer Node
export const TokenTransferNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #a855f7, #9333ea)", border: "2px solid #c084fc" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#c084fc", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#c084fc", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <Layers className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "TRANSFER TOKEN"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Send CashTokens</div>
  </div>
))
TokenTransferNode.displayName = "TokenTransferNode"

// OP_RETURN Node
export const OpReturnNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #f97316, #ea580c)", border: "2px solid #fb923c" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#fb923c", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#fb923c", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <FileText className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "OP_RETURN"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Store data on-chain</div>
  </div>
))
OpReturnNode.displayName = "OpReturnNode"

// Get Balance Node
export const GetBalanceNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #06b6d4, #0891b2)", border: "2px solid #22d3ee" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#22d3ee", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#22d3ee", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <Wallet className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "GET BALANCE"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Check wallet balance</div>
  </div>
))
GetBalanceNode.displayName = "GetBalanceNode"

// Wait for Balance Node
export const WaitForBalanceNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", border: "2px solid #a78bfa" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#a78bfa", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#a78bfa", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <Clock className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "WAIT BALANCE"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Wait for funds</div>
  </div>
))
WaitForBalanceNode.displayName = "WaitForBalanceNode"

// Condition Node
export const ConditionNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #14b8a6, #0d9488)", border: "2px solid #2dd4bf" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#2dd4bf", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} id="true" style={{ background: "#22c55e", width: 10, height: 10, top: '30%' }} />
    <Handle type="source" position={Position.Right} id="false" style={{ background: "#ef4444", width: 10, height: 10, top: '70%' }} />
    <div className="flex items-center gap-2">
      <FileCode className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "CONDITION"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">If/else logic</div>
  </div>
))
ConditionNode.displayName = "ConditionNode"

// Output Node
export const OutputNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #6b7280, #4b5563)", border: "2px solid #9ca3af" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#9ca3af", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "OUTPUT"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Display results</div>
  </div>
))
OutputNode.displayName = "OutputNode"

// Execute Transaction Node
export const ExecuteTxnNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #ec4899, #db2777)", border: "2px solid #f472b6" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#f472b6", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#f472b6", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <Play className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "EXECUTE"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Send to network</div>
  </div>
))
ExecuteTxnNode.displayName = "ExecuteTxnNode"

// Multi-Send Node
export const MultiSendNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #10b981, #059669)", border: "2px solid #34d399" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#34d399", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#34d399", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <UserPlus className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "MULTI-SEND"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Send to many</div>
  </div>
))
MultiSendNode.displayName = "MultiSendNode"

// Token Mint Node
export const TokenMintNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #fbbf24, #d97706)", border: "2px solid #fbcf33" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#fbcf33", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#fbcf33", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <PlusSquare className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "MINT TOKEN"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Mint more supply</div>
  </div>
))
TokenMintNode.displayName = "TokenMintNode"

// Token Burn Node
export const TokenBurnNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #ef4444, #dc2626)", border: "2px solid #f87171" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#f87171", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#f87171", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <Flame className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "BURN TOKEN"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Destroy tokens</div>
  </div>
))
TokenBurnNode.displayName = "TokenBurnNode"

// Price Feed Node
export const PriceNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #3b82f6, #2563eb)", border: "2px solid #60a5fa" }}>
    <Handle type="source" position={Position.Right} style={{ background: "#60a5fa", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <TrendingUp className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "PRICE FEED"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">BCH/USD Market Price</div>
  </div>
))
PriceNode.displayName = "PriceNode"

// Prepare Wallet Node (for Token Genesis Fix)
export const PrepareWalletNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "2px solid #fbbf24" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#fbbf24", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#fbbf24", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <Hammer className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "PREPARE WALLET"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Fix Genesis vout=0 error</div>
  </div>
))
PrepareWalletNode.displayName = "PrepareWalletNode"

// Delay Node
export const DelayNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "2px solid #818cf8" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#818cf8", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#818cf8", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <Clock3 className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "DELAY"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Wait for {data.config?.seconds || 0}s</div>
  </div>
))
DelayNode.displayName = "DelayNode"

// Legacy exports for compatibility
export const AssetTransferNode = TokenTransferNode
export const ApplicationCallNode = OpReturnNode
export const AssetCreateNode = TokenCreateNode
export const KeyRegNode = WaitForBalanceNode
export const SignTxnNode = GetBalanceNode
export const AssetFreezeNode = ConditionNode
