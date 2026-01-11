"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Settings } from "lucide-react"
import type { Node } from "@xyflow/react"

interface NodePropertiesPanelProps {
  selectedNode: Node | null
  onClose: () => void
  onUpdateNode: (nodeId: string, data: any) => void
}

interface NodeConfig {
  address?: string
  wif?: string
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

  const renderConfigFields = () => {
    switch (selectedNode.data.nodeType) {
      case "account":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-white">
                BCH Address (CashAddr)
              </Label>
              <Input
                id="address"
                value={config.address || ""}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                placeholder="bitcoincash:qr..."
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="wif" className="text-white">
                Private Key (WIF)
              </Label>
              <Input
                id="wif"
                type="password"
                value={config.wif || ""}
                onChange={(e) => setConfig({ ...config, wif: e.target.value })}
                placeholder="Enter WIF private key"
                className="bg-gray-800 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Keep this secret! Used for signing transactions.
              </p>
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
                className="bg-gray-800 border-gray-600 text-white"
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
                placeholder="bitcoincash:qr... or bchtest:qr..."
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        )

      case "tokenTransfer":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tokenId" className="text-white">
                Token ID (Category)
              </Label>
              <Input
                id="tokenId"
                value={config.tokenId || ""}
                onChange={(e) => setConfig({ ...config, tokenId: e.target.value })}
                placeholder="Enter CashToken category ID"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-white">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={config.amount || ""}
                onChange={(e) => setConfig({ ...config, amount: Number.parseInt(e.target.value) })}
                placeholder="1"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="receiver" className="text-white">
                Receiver Address (Token Address)
              </Label>
              <Input
                id="receiver"
                value={config.receiver || ""}
                onChange={(e) => setConfig({ ...config, receiver: e.target.value })}
                placeholder="bitcoincash:zr..."
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        )

      case "tokenCreate":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">
                Token Name
              </Label>
              <Input
                id="name"
                value={config.name || ""}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                placeholder="My Awesome Token"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="symbol" className="text-white">
                Token Symbol
              </Label>
              <Input
                id="symbol"
                value={config.symbol || ""}
                onChange={(e) => setConfig({ ...config, symbol: e.target.value })}
                placeholder="WAT"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-white">
                Initial Supply
              </Label>
              <Input
                id="amount"
                type="number"
                value={config.amount || ""}
                onChange={(e) => setConfig({ ...config, amount: Number.parseInt(e.target.value) })}
                placeholder="1000000"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="commitment" className="text-white">
                NFT Commitment (Optional)
              </Label>
              <Input
                id="commitment"
                value={config.commitment || ""}
                onChange={(e) => setConfig({ ...config, commitment: e.target.value })}
                placeholder="Hex string for NFT commitment"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="capability" className="text-white">
                NFT Capability
              </Label>
              <Select
                value={config.capability || "none"}
                onValueChange={(value) => setConfig({ ...config, capability: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="none">None (Immutable)</SelectItem>
                  <SelectItem value="mutable">Mutable</SelectItem>
                  <SelectItem value="minting">Minting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "multiSend":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipients" className="text-white">
                Recipients (Address, Amount)
              </Label>
              <Textarea
                id="recipients"
                value={config.recipients || ""}
                onChange={(e) => setConfig({ ...config, recipients: e.target.value })}
                placeholder="address1, 0.001&#10;address2, 0.005"
                className="bg-gray-800 border-gray-600 text-white h-32"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter one recipient per line: address, amount
              </p>
            </div>
          </div>
        )

      case "tokenMint":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tokenId" className="text-white">
                Token ID (Category)
              </Label>
              <Input
                id="tokenId"
                value={config.tokenId || ""}
                onChange={(e) => setConfig({ ...config, tokenId: e.target.value })}
                placeholder="Category ID of the token"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-white">
                Amount to Mint
              </Label>
              <Input
                id="amount"
                type="number"
                value={config.amount || ""}
                onChange={(e) => setConfig({ ...config, amount: Number.parseInt(e.target.value) })}
                placeholder="1000000"
                className="bg-gray-800 border-gray-600 text-white"
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
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        )

      case "tokenBurn":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tokenId" className="text-white">
                Token ID (Category)
              </Label>
              <Input
                id="tokenId"
                value={config.tokenId || ""}
                onChange={(e) => setConfig({ ...config, tokenId: e.target.value })}
                placeholder="Category ID of the token"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-white">
                Amount to Burn
              </Label>
              <Input
                id="amount"
                type="number"
                value={config.amount || ""}
                onChange={(e) => setConfig({ ...config, amount: Number.parseInt(e.target.value) })}
                placeholder="1"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        )

      case "priceFeed":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pair" className="text-white">
                Price Pair
              </Label>
              <Select
                value={config.pair || "BCH/USD"}
                onValueChange={(value) => setConfig({ ...config, pair: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="BCH/USD">BCH / USD</SelectItem>
                  <SelectItem value="BCH/EUR">BCH / EUR</SelectItem>
                  <SelectItem value="BCH/BTC">BCH / BTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "delay":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="seconds" className="text-white">
                Delay Seconds
              </Label>
              <Input
                id="seconds"
                type="number"
                value={config.seconds || 5}
                onChange={(e) => setConfig({ ...config, seconds: Number.parseInt(e.target.value) })}
                placeholder="5"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        )

      case "opReturn":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="message" className="text-white">
                OP_RETURN Message
              </Label>
              <Textarea
                id="message"
                value={config.message || ""}
                onChange={(e) => setConfig({ ...config, message: e.target.value })}
                placeholder="Enter message to store on-chain"
                className="bg-gray-800 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Data stored permanently on the blockchain
              </p>
            </div>
          </div>
        )

      case "getBalance":
        return (
          <div className="space-y-4">
            <div className="text-gray-400 text-sm">
              This node will fetch the current BCH balance of the connected wallet.
            </div>
            <div>
              <Label htmlFor="unit" className="text-white">
                Display Unit
              </Label>
              <Select
                value={config.unit || "bch"}
                onValueChange={(value) => setConfig({ ...config, unit: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="bch">BCH</SelectItem>
                  <SelectItem value="sat">Satoshis</SelectItem>
                  <SelectItem value="usd">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "waitForBalance":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="targetBalance" className="text-white">
                Target Balance (BCH)
              </Label>
              <Input
                id="targetBalance"
                type="number"
                step="0.00000001"
                value={config.targetBalance || ""}
                onChange={(e) => setConfig({ ...config, targetBalance: Number.parseFloat(e.target.value) })}
                placeholder="0.001"
                className="bg-gray-800 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Execution will pause until wallet reaches this balance
              </p>
            </div>
          </div>
        )

      case "condition":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="condition" className="text-white">
                Condition Type
              </Label>
              <Select
                value={config.condition || "balance"}
                onValueChange={(value) => setConfig({ ...config, condition: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="balance">BCH Balance</SelectItem>
                  <SelectItem value="token">Token Balance</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="operator" className="text-white">
                Operator
              </Label>
              <Select
                value={config.operator || ">"}
                onValueChange={(value) => setConfig({ ...config, operator: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value=">">Greater Than</SelectItem>
                  <SelectItem value="<">Less Than</SelectItem>
                  <SelectItem value="==">Equal To</SelectItem>
                  <SelectItem value="!=">Not Equal To</SelectItem>
                  <SelectItem value=">=">Greater Than or Equal</SelectItem>
                  <SelectItem value="<=">Less Than or Equal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value" className="text-white">
                Value
              </Label>
              <Input
                id="value"
                value={config.value || ""}
                onChange={(e) => setConfig({ ...config, value: e.target.value })}
                placeholder="0.001"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        )

      case "output":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="format" className="text-white">
                Output Format
              </Label>
              <Select
                value={config.format || "JSON"}
                onValueChange={(value) => setConfig({ ...config, format: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="JSON">JSON</SelectItem>
                  <SelectItem value="TEXT">Text</SelectItem>
                  <SelectItem value="TABLE">Table</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-gray-400 text-center py-4">No configuration options available for this node type.</div>
        )
    }
  }

  return (
    <div className="fixed right-4 top-20 bottom-4 w-80 bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-lg z-50 flex flex-col">
      <Card className="h-full bg-transparent border-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-green-400" />
            <CardTitle className="text-white text-sm">Node Properties</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div>
              <Label className="text-white font-semibold">Node Type</Label>
              <Badge variant="secondary" className="mt-1 bg-green-600/20 text-green-400">
                {String(selectedNode.data.label)}
              </Badge>
            </div>
            <div>
              <Label className="text-white font-semibold">Node ID</Label>
              <div className="text-gray-400 text-sm font-mono">{selectedNode.id}</div>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <Label className="text-white font-semibold mb-3 block">Configuration</Label>
              {renderConfigFields()}
            </div>
          </div>
        </CardContent>
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
