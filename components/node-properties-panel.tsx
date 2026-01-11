"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Settings, Upload, Image as ImageIcon } from "lucide-react"
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
  image?: string // Base64 image
  signature?: string
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

      case "imageUpload":
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              {config.image ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-700 bg-black">
                  <img src={config.image} alt="Preview" className="w-full h-full object-contain" />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => setConfig({ ...config, image: undefined })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-full h-40 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center bg-gray-900/50">
                  <ImageIcon className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-gray-500 text-xs text-center px-4">Upload NFT image<br />(PNG, JPG, WEBP)</span>
                </div>
              )}
              <div className="w-full">
                <input
                  type="file"
                  id="nft-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Button
                  asChild
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <label htmlFor="nft-image" className="cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {config.image ? "Change Image" : "Select Image"}
                  </label>
                </Button>
              </div>
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
                NFT Commitment (Hex)
              </Label>
              <Input
                id="commitment"
                value={config.commitment || ""}
                onChange={(e) => setConfig({ ...config, commitment: e.target.value })}
                placeholder="e.g. 010203"
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

      case "assetList":
        return (
          <div className="space-y-4">
            <div className="text-gray-400 text-sm">
              This node will scan the wallet for all CashTokens and NFTs.
            </div>
          </div>
        )

      case "tokenHolders":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tokenId" className="text-white">
                Token Category ID
              </Label>
              <Input
                id="tokenId"
                value={config.tokenId || ""}
                onChange={(e) => setConfig({ ...config, tokenId: e.target.value })}
                placeholder="Enter Token ID to fetch holders"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="text-gray-400 text-xs">
              This will generate a CSV list of all current holders and their balances.
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
                placeholder="bitcoincash:qr..."
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        )

      case "signMessage":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="message" className="text-white">
                Message to Sign
              </Label>
              <Textarea
                id="message"
                value={config.message || ""}
                onChange={(e) => setConfig({ ...config, message: e.target.value })}
                placeholder="Enter text to sign with your private key"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        )

      case "verifyMessage":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="message" className="text-white">
                Original Message
              </Label>
              <Textarea
                id="message"
                value={config.message || ""}
                onChange={(e) => setConfig({ ...config, message: e.target.value })}
                placeholder="The original text"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-white">
                Signer Address
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
              <Label htmlFor="signature" className="text-white">
                Signature (Base64)
              </Label>
              <Textarea
                id="signature"
                value={config.signature || ""}
                onChange={(e) => setConfig({ ...config, signature: e.target.value })}
                placeholder="Paste the signature here"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        )

      case "watchAddress":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-white">
                Address to Watch
              </Label>
              <Input
                id="address"
                value={config.address || ""}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                placeholder="bitcoincash:qr..."
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <p className="text-xs text-gray-400">
              No private key needed. This node acts as a read-only wallet.
            </p>
          </div>
        )

      case "generateWallet":
        return (
          <div className="space-y-4">
            <div className="text-gray-400 text-sm">
              This node will generate a fresh 12-word mnemonic and private key during execution.
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-400 font-medium">
                Note: The new wallet details will be printed in the terminal.
              </p>
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
            </div>
          </div>
        )

      default:
        return (
          <div className="text-gray-400 text-center py-4">Configuration loaded.</div>
        )
    }
  }

  return (
    <div className="fixed right-4 top-20 bottom-4 w-80 bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-lg z-[100] flex flex-col shadow-2xl overflow-hidden">
      <Card className="h-full bg-transparent border-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-green-400" />
            <CardTitle className="text-white text-sm">Node Settings</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4 custom-scrollbar">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white font-semibold">Label</Label>
              <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                {String(selectedNode.data.label)}
              </Badge>
            </div>
            <div className="border-t border-gray-700 pt-4">
              {renderConfigFields()}
            </div>
          </div>
        </CardContent>
        <div className="p-4 border-t border-gray-700 bg-gray-900/50">
          <div className="flex space-x-2">
            <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-black font-bold">
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-700 text-gray-400 hover:bg-gray-800 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
