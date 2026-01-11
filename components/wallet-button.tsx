"use client"

import { useState, useEffect } from "react"
import { WalletIcon, Loader2 } from "lucide-react"

interface BCHWallet {
  address: string
  cashaddr: string
  balance: number
  privateKeyWif: string
  mnemonic: string
  derivationPath: string
  transactions: any[]
  bchPrice: number
}

interface WalletButtonProps {
  onWalletChange?: (wallet: BCHWallet | null) => void
  onTogglePanel?: () => void
}

export function WalletButton({ onWalletChange, onTogglePanel }: WalletButtonProps) {
  const [wallet, setWallet] = useState<BCHWallet | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const savedWallet = localStorage.getItem("bch-wallet")
    if (savedWallet) {
      try {
        const parsedWallet = JSON.parse(savedWallet)
        if (parsedWallet && typeof parsedWallet.cashaddr === 'string') {
          setWallet(parsedWallet)
          onWalletChange?.(parsedWallet)
        } else {
          localStorage.removeItem("bch-wallet")
        }
      } catch (error) {
        console.error("Error parsing wallet:", error)
        localStorage.removeItem("bch-wallet")
      }
    }
  }, [])

  const createWallet = async () => {
    try {
      setIsCreating(true)
      
      // Use mainnet-js to create a new wallet
      const { TestNetWallet, Wallet } = await import("mainnet-js")
      
      // Create a random testnet wallet
      const bchWallet = await TestNetWallet.newRandom()
      
      const newWallet: BCHWallet = {
        address: bchWallet.cashaddr || "",
        cashaddr: bchWallet.cashaddr || "",
        balance: 0,
        privateKeyWif: bchWallet.privateKeyWif || "",
        mnemonic: bchWallet.mnemonic || "",
        derivationPath: bchWallet.derivationPath || "m/44'/0'/0'/0/0",
        transactions: [],
        bchPrice: 0,
      }

      setWallet(newWallet)
      localStorage.setItem("bch-wallet", JSON.stringify(newWallet))
      onWalletChange?.(newWallet)
      
      console.log("BCH Wallet created!")
      console.log(`Address: ${newWallet.cashaddr}`)
      console.log("To get test BCH, use: https://tbch.googol.cash/")
    } catch (error) {
      console.error("Error creating wallet:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      {wallet && wallet.cashaddr ? (
        <button
          onClick={onTogglePanel}
          className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
          style={{ backgroundColor: "var(--button-color)", color: "var(--text-color)" }}
        >
          <WalletIcon className="h-3 w-3 inline mr-1" />
          {`${String(wallet.cashaddr.substring(0, 16))}...`}
        </button>
      ) : (
        <button
          onClick={createWallet}
          disabled={isCreating}
          className="px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50"
          style={{ backgroundColor: "var(--button-color)", color: "var(--text-color)" }}
        >
          {isCreating ? (
            <>
              <Loader2 className="h-3 w-3 inline mr-1 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <WalletIcon className="h-3 w-3 inline mr-1" />
              Create BCH Wallet
            </>
          )}
        </button>
      )}
    </>
  )
}
