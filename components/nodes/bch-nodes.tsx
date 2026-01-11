"use client"

import { memo, useRef } from "react"
import { Handle, Position } from "@xyflow/react"
import { Wallet, Send, Coins, FileCode, CheckCircle, Play, Snowflake, FileText, Clock, Layers, PlusSquare, Zap, TrendingUp, UserPlus, Clock3, Flame, Hammer, Image as ImageIcon, Users, List, Monitor, Upload, Download, Eye, PenLine, ShieldCheck, Key } from "lucide-react"

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

// Prepare Wallet Node
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

// Image Upload Node (NFT Preview)
export const ImageUploadNode = memo(({ data }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    // Note: In a real flow, you'd use a callback passed through data
    // Here we just trigger the hidden input if it were connected to state
    fileInputRef.current?.click()
  }

  return (
    <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #ec4899, #be185d)", border: "2px solid #f472b6", minWidth: "220px" }}>
      <Handle type="source" position={Position.Right} style={{ background: "#f472b6", width: 10, height: 10 }} />
      <div className="flex items-center gap-2 mb-3">
        <ImageIcon className="w-5 h-5 text-white" />
        <span className="text-white font-bold text-sm">NFT IMAGE</span>
      </div>

      {data.config?.image ? (
        <div className="relative group rounded-lg overflow-hidden border border-white/20 bg-black/40 mb-3">
          <img src={data.config.image} alt="NFT Preview" className="w-full h-32 object-contain" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">CHANGE IMAGE</span>
          </div>
        </div>
      ) : (
        <div
          onClick={handleUploadClick}
          className="border-2 border-dashed border-white/20 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 cursor-pointer transition-colors mb-3"
        >
          <Upload className="w-6 h-6 text-white/40" />
          <span className="text-white/40 text-[10px] font-bold">UPLOAD IMAGE</span>
        </div>
      )}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
      <div className="text-white/60 text-[10px] text-center">Binary data for NFT commitment</div>
    </div>
  )
})
ImageUploadNode.displayName = "ImageUploadNode"

// Asset List Node
export const AssetListNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #06b6d4, #0891b2)", border: "2px solid #22d3ee" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#22d3ee", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#22d3ee", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <List className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">FETCH ASSETS</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Get all wallet tokens</div>
  </div>
))
AssetListNode.displayName = "AssetListNode"

// Watch Address Node
export const WatchAddressNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #64748b, #475569)", border: "2px solid #94a3b8" }}>
    <Handle type="source" position={Position.Right} style={{ background: "#94a3b8", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <Eye className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "WATCH ADDRESS"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Monitor without keys</div>
  </div>
))
WatchAddressNode.displayName = "WatchAddressNode"

// Sign Message Node
export const SignMessageNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", border: "2px solid #a78bfa" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#a78bfa", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#a78bfa", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <PenLine className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "SIGN MESSAGE"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Cryptographic proof</div>
  </div>
))
SignMessageNode.displayName = "SignMessageNode"

// Verify Message Node
export const VerifyMessageNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #10b981, #047857)", border: "2px solid #34d399" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#34d399", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#34d399", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <ShieldCheck className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "VERIFY MESSAGE"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Check signature</div>
  </div>
))
VerifyMessageNode.displayName = "VerifyMessageNode"

// Wallet Generation Node
export const WalletGenNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #f59e0b, #b45309)", border: "2px solid #fbbf24" }}>
    <Handle type="source" position={Position.Right} style={{ background: "#fbbf24", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <Key className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">{data.label || "GENERATE WALLET"}</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Create new seed/keys</div>
  </div>
))
WalletGenNode.displayName = "WalletGenNode"

// Token Holders Node
export const TokenHoldersNode = memo(({ data }: any) => (
  <div style={{ ...baseNodeStyle, background: "linear-gradient(135deg, #6366f1, #4338ca)", border: "2px solid #818cf8" }}>
    <Handle type="target" position={Position.Left} style={{ background: "#818cf8", width: 10, height: 10 }} />
    <Handle type="source" position={Position.Right} style={{ background: "#818cf8", width: 10, height: 10 }} />
    <div className="flex items-center gap-2">
      <Users className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-sm">TOKEN HOLDERS</span>
    </div>
    <div className="text-white/80 text-xs mt-1">Fetch holders & CSV</div>
  </div>
))
TokenHoldersNode.displayName = "TokenHoldersNode"

// Output / Holdings Node
export const OutputNode = memo(({ data }: any) => (
  <div style={{
    ...baseNodeStyle,
    background: "#0a0a0a",
    border: "2px solid #333",
    minWidth: "260px",
    padding: "0",
    overflow: "hidden"
  }}>
    <Handle type="target" position={Position.Left} style={{ background: "#666", width: 10, height: 10 }} />
    <div className="bg-[#1a1a1a] p-3 border-b border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Monitor className="w-4 h-4 text-green-500" />
        <span className="text-white font-bold text-xs">OUTPUT PANEL</span>
      </div>
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-red-500/50" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
        <div className="w-2 h-2 rounded-full bg-green-500/50" />
      </div>
    </div>

    <div className="p-4 bg-black/40 min-h-[100px]">
      {data.config?.holdings ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-gray-500 text-[10px] font-bold">ASSET</span>
            <span className="text-gray-500 text-[10px] font-bold">BALANCE</span>
          </div>
          {data.config.holdings.map((h: any, i: number) => (
            <div key={i} className="flex justify-between items-center group">
              <div className="flex flex-col">
                <span className="text-white text-[10px] font-medium truncate w-32">{h.name || h.tokenId.substring(0, 10)}</span>
                <span className="text-gray-600 text-[8px] font-mono">{h.symbol || 'Token'}</span>
              </div>
              <span className="text-green-500 text-xs font-mono font-bold">{h.amount}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 opacity-20">
          <Zap className="w-8 h-8 text-white mb-2" />
          <span className="text-white text-[10px] font-bold">Awaiting Execution...</span>
        </div>
      )}
    </div>
    <div className="p-2 bg-[#0d0d0d] text-[8px] font-mono text-gray-700 text-center uppercase tracking-widest border-t border-white/5">
      Live Wallet Holdings Display
    </div>
  </div>
))
OutputNode.displayName = "OutputNode"

// --- Rest of nodes ---
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
