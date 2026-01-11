"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Settings, Upload, Image as ImageIcon, Key, Wallet, Database, Calculator, RefreshCcw, Shuffle, Plus } from "lucide-react"
import type { Node } from "@xyflow/react"

interface NodePropertiesPanelProps {
  selectedNode: Node | null
  onClose: () => void
  onUpdateNode: (nodeId: string, data: any) => void
}

interface NodeConfig {
  address?: string
  wif?: string
  mnemonic?: string
  amount?: number
  receiver?: string
  tokenId?: string
  commitment?: string
  capability?: string
  message?: string
  unit?: string
  targetBalance?: number
  condition?: string
  operator?: string
  value?: string
  format?: string
  recipients?: string
  name?: string
  symbol?: string
  seconds?: number
  pair?: string
  image?: string // Base64 image
  signature?: string
  rate?: number
  count?: number
  amountPerOutput?: number
  pool?: string
  target?: number
  iterations?: number
  operation?: string
  key?: string
}

export function NodePropertiesPanel({ selectedNode, onClose, onUpdateNode }: NodePropertiesPanelProps) {
  const [config, setConfig] = useState<NodeConfig>(selectedNode?.data?.config || {})

  if (!selectedNode) return null

  const handleSave = () => {
    onUpdateNode(selectedNode.id, {
      ...selectedNode.data,
      config: config,
    })
    onClose()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setConfig({ ...config, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const renderConfigFields = () => {
    switch (selectedNode.data.nodeType) {
      case "account":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="wif" className="text-white flex items-center gap-2">
                <Key className="w-3 h-3" /> Private Key (WIF)
              </Label>
              <Input
                id="wif"
                type="password"
                value={config.wif || ""}
                onChange={(e) => setConfig({ ...config, wif: e.target.value })}
                placeholder="Paste WIF (starts with K or L)"
                className="bg-black/50 border-gray-800 text-white"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-800"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-gray-900 px-2 text-gray-500">OR</span></div>
            </div>
            <div>
              <Label htmlFor="mnemonic" className="text-white flex items-center gap-2">
                <Database className="w-3 h-3" /> Mnemonic Phrase
              </Label>
              <Textarea
                id="mnemonic"
                value={config.mnemonic || ""}
                onChange={(e) => setConfig({ ...config, mnemonic: e.target.value })}
                placeholder="Enter your 12 or 24 word phrase"
                className="bg-black/50 border-gray-800 text-white h-20"
              />
            </div>
            <p className="text-[10px] text-gray-500 italic">
              * Leave both blank to use the default active wallet or generate a temporary one during execution.
            </p>
          </div>
        )

      case "splitUTXO":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Number of Outputs</Label>
              <Input
                type="number"
                value={config.count || 10}
                onChange={(e) => setConfig({ ...config, count: parseInt(e.target.value) })}
                className="bg-black/50 border-gray-800 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Amount per Output (BCH)</Label>
              <Input
                type="number"
                step="0.00000001"
                value={config.amountPerOutput || 0.0001}
                onChange={(e) => setConfig({ ...config, amountPerOutput: parseFloat(e.target.value) })}
                className="bg-black/50 border-gray-800 text-white"
              />
            </div>
          </div>
        )

      case "feeController":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Fee Rate (sat/byte)</Label>
              <Select
                value={String(config.rate || "1")}
                onValueChange={(val) => setConfig({ ...config, rate: parseInt(val) })}
              >
                <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="1">Minimal (1 sat/B)</SelectItem>
                  <SelectItem value="2">Standard (2 sat/B)</SelectItem>
                  <SelectItem value="5">Priority (5 sat/B)</SelectItem>
                  <SelectItem value="10">Aggressive (10 sat/B)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "autoRemix":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Anon Score Target</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={config.target || 5}
                onChange={(e) => setConfig({ ...config, target: parseInt(e.target.value) })}
                className="bg-black/50 border-gray-800 text-white"
              />
              <p className="text-[10px] text-gray-500 mt-2 italic">Higher score = more rounds of mixing but more fees.</p>
            </div>
          </div>
        )

      case "mathNode":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Operation</Label>
              <Select
                value={config.operation || "sum"}
                onValueChange={(val) => setConfig({ ...config, operation: val })}
              >
                <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="sum">Add (+)</SelectItem>
                  <SelectItem value="sub">Subtract (-)</SelectItem>
                  <SelectItem value="mul">Multiply (*)</SelectItem>
                  <SelectItem value="div">Divide (/)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white">Value</Label>
              <Input
                type="number"
                value={config.value || 0}
                onChange={(e) => setConfig({ ...config, value: e.target.value })}
                className="bg-black/50 border-gray-800 text-white"
              />
            </div>
          </div>
        )

      case "loop":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Iterations</Label>
              <Input
                type="number"
                value={config.iterations || 3}
                onChange={(e) => setConfig({ ...config, iterations: parseInt(e.target.value) })}
                className="bg-black/50 border-gray-800 text-white"
              />
            </div>
          </div>
        )

      case "variableNode":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Variable Name</Label>
              <Input
                value={config.key || ""}
                onChange={(e) => setConfig({ ...config, key: e.target.value.toUpperCase() })}
                placeholder="MY_VAR"
                className="bg-black/50 border-gray-800 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Value (Optional Init)</Label>
              <Input
                value={config.value || ""}
                onChange={(e) => setConfig({ ...config, value: e.target.value })}
                className="bg-black/50 border-gray-800 text-white"
              />
            </div>
          </div>
        )

      case "payment":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-white">
                Amount (BCH)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.00000001"
                value={config.amount || ""}
                onChange={(e) => setConfig({ ...config, amount: Number.parseFloat(e.target.value) })}
                placeholder="0.001"
                className="bg-black/50 border-gray-800 text-white"
              />
            </div>
            <div>
              <Label htmlFor="receiver" className="text-white">
                Receiver Address
              </Label>
              <Input
                id="receiver"
                value={config.receiver || ""}
                onChange={(e) => setConfig({ ...config, receiver: e.target.value })}
                placeholder="bitcoincash:qr..."
                className="bg-black/50 border-gray-800 text-white"
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-gray-500 text-center py-8 italic border border-dashed border-gray-800 rounded-lg">
            No specific settings for this Pro node. <br /> Works automatically during flow.
          </div>
        )
    }
  }

  return (
    <div className="fixed right-4 top-20 bottom-4 w-80 bg-[#0d0d0d]/95 backdrop-blur-xl border border-gray-800/50 rounded-2xl z-[100] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-right duration-300">
      <Card className="h-full bg-transparent border-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-800/50 bg-black/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Settings className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-white text-sm font-bold tracking-tight">Configuration</CardTitle>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{String(selectedNode.data.label)}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-white hover:bg-white/5 rounded-full h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-6 custom-scrollbar">
          {renderConfigFields()}
        </CardContent>
        <div className="p-4 border-t border-gray-800/50 bg-black/40 backdrop-blur-md">
          <div className="flex space-x-2">
            <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-black font-bold h-10 rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(22,163,74,0.2)]">
              Apply Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
