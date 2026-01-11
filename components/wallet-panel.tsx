"use client"

import { useState, useEffect } from "react"
import { X, Send, RefreshCw, ExternalLink, Copy, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BCHWallet {
  address: string
  cashaddr: string
  balance: number
  privateKeyWif: string
  mnemonic: string
  derivationPath: string
  transactions?: any[]
  bchPrice?: number
}

interface WalletPanelProps {
  wallet?: BCHWallet
  onClose: () => void
}

export function WalletPanel({ wallet, onClose }: WalletPanelProps) {
  const [sendAmount, setSendAmount] = useState("")
  const [sendAddress, setSendAddress] = useState("")
  const [bchPrice, setBchPrice] = useState(wallet?.bchPrice || 0)
  const [realBalance, setRealBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet')
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<string | null>(null)

  const fetchBchPrice = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd")
      const data = await response.json()
      setBchPrice(data["bitcoin-cash"]?.usd || 0)
    } catch (error) {
      console.error("Error fetching BCH price:", error)
      setBchPrice(450) // Fallback price
    }
  }

  const fetchBalanceAndTransactions = async () => {
    if (!wallet?.cashaddr) return

    setIsLoading(true)
    setError(null)

    try {
      const { TestNetWallet, Wallet } = await import("mainnet-js")

      // Recreate wallet from saved data
      const bchWallet = network === 'testnet'
        ? await TestNetWallet.fromWIF(wallet.privateKeyWif)
        : await Wallet.fromWIF(wallet.privateKeyWif)

      const balance = await bchWallet.getBalance()
      setRealBalance(balance.sat || 0)

    } catch (error) {
      console.error("Error fetching wallet data:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch wallet data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    if (!wallet || !sendAddress || !sendAmount) return

    setIsSending(true)
    setSendResult(null)
    setError(null)

    try {
      const { TestNetWallet, Wallet } = await import("mainnet-js")

      const bchWallet = network === 'testnet'
        ? await TestNetWallet.fromWIF(wallet.privateKeyWif)
        : await Wallet.fromWIF(wallet.privateKeyWif)

      const txData = await bchWallet.send([
        {
          cashaddr: sendAddress,
          value: parseFloat(sendAmount),
          unit: 'bch',
        }
      ])

      setSendResult(`Transaction sent! TxID: ${txData.txId}`)
      setSendAmount("")
      setSendAddress("")

      // Refresh balance
      await fetchBalanceAndTransactions()
    } catch (error) {
      console.error("Error sending transaction:", error)
      setError(error instanceof Error ? error.message : "Failed to send transaction")
    } finally {
      setIsSending(false)
    }
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    await fetchBalanceAndTransactions()
    setIsRefreshing(false)
  }

  const handleBackupAccount = () => {
    if (wallet) {
      const walletData = {
        cashaddr: wallet.cashaddr,
        mnemonic: wallet.mnemonic,
        privateKeyWif: wallet.privateKeyWif,
        derivationPath: wallet.derivationPath,
      }
      const json = JSON.stringify(walletData, null, 2)
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `bch_wallet_${wallet.cashaddr.substring(12, 20)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  useEffect(() => {
    if (!wallet?.bchPrice) {
      fetchBchPrice()
    }
  }, [wallet?.bchPrice])

  useEffect(() => {
    if (wallet?.cashaddr) {
      fetchBalanceAndTransactions()
    }
  }, [wallet?.cashaddr, network])

  if (!wallet || !wallet.cashaddr) {
    return null
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.cashaddr)
  }

  const balanceInSat = realBalance !== null ? realBalance : wallet.balance
  const balanceInBCH = balanceInSat / 100000000
  const balanceInUSD = balanceInBCH * bchPrice

  return (
    <div className="h-full bg-[#252526] flex flex-col">
      {/* Header */}
      <div className="h-8 bg-[#2d2d30] flex items-center justify-between px-3 text-xs font-medium border-b border-[#3e3e42]">
        <div className="flex items-center gap-2">
          <span>BCH WALLET</span>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value as 'testnet' | 'mainnet')}
            className="bg-[#1e1e1e] text-[#cccccc] border border-[#3e3e42] rounded px-1 text-xs"
          >
            <option value="testnet">TestNet</option>
            <option value="mainnet">MainNet</option>
          </select>
        </div>
        <Button variant="ghost" size="icon" className="w-4 h-4" onClick={onClose}>
          <X className="w-3 h-3" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Wallet Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
            <div>
              <div className="text-sm font-medium">Bitcoin Cash Wallet</div>
              <div className="text-xs text-[#969696] flex items-center gap-1">
                {wallet.cashaddr.substring(0, 30)}...
                <Button variant="ghost" size="icon" className="w-3 h-3" onClick={copyAddress}>
                  <Copy className="w-2 h-2" />
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading balance...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{balanceInBCH.toFixed(8)} BCH</div>
                {bchPrice > 0 && <div className="text-sm text-[#969696]">${balanceInUSD.toFixed(2)} USD</div>}
                {bchPrice > 0 && <div className="text-xs text-[#969696]">1 BCH = ${bchPrice.toFixed(2)}</div>}
                {realBalance !== null && (
                  <div className="text-xs text-green-400 mt-1">✓ Live data</div>
                )}
                {realBalance === null && !isLoading && (
                  <div className="text-xs text-yellow-400 mt-1">⚠ Using cached data</div>
                )}
              </>
            )}
            {error && (
              <div className="text-xs text-red-400 mt-1">{error}</div>
            )}
            {sendResult && (
              <div className="text-xs text-green-400 mt-1">{sendResult}</div>
            )}
          </div>

          {/* Send Form */}
          <div className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="Recipient address (bchtest:...)"
              value={sendAddress}
              onChange={(e) => setSendAddress(e.target.value)}
              className="w-full px-2 py-1 text-xs bg-[#1e1e1e] border border-[#3e3e42] rounded"
            />
            <input
              type="number"
              placeholder="Amount (BCH)"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              className="w-full px-2 py-1 text-xs bg-[#1e1e1e] border border-[#3e3e42] rounded"
              step="0.00000001"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              className="flex-1 bg-[#0e639c] hover:bg-[#1177bb]"
              onClick={handleSend}
              disabled={isSending || !sendAddress || !sendAmount}
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send
            </Button>
            <Button
              variant="outline"
              className="border-[#3e3e42] text-[#cccccc] hover:bg-[#37373d]"
              onClick={refreshData}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-[#3e3e42] text-[#cccccc] hover:bg-[#37373d]"
              onClick={handleBackupAccount}
            >
              <Download className="w-4 h-4 mr-2" />
              Backup
            </Button>
          </div>
        </div>

        {/* Faucet Info */}
        <div className="bg-[#1e1e1e] rounded p-3 mb-4">
          <h3 className="text-sm font-medium mb-2">Get Test BCH</h3>
          <p className="text-xs text-[#969696] mb-2">
            Need testnet BCH? Visit the faucet:
          </p>
          <Button
            variant="ghost"
            className="text-xs text-[#569cd6] p-0"
            onClick={() => window.open('https://tbch.googol.cash/', '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            tbch.googol.cash
          </Button>
        </div>

        {/* Explorer Link */}
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            className="text-xs text-[#569cd6]"
            onClick={() => window.open(
              network === 'testnet'
                ? `https://chipnet.imaginary.cash/address/${wallet.cashaddr}`
                : `https://explorer.bitcoin.com/bch/address/${wallet.cashaddr}`,
              '_blank'
            )}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View on Block Explorer
          </Button>
        </div>
      </div>
    </div>
  )
}
