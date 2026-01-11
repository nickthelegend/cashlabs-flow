"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Eye,
  Send,
  AlertTriangle,
  CheckCircle,
  Copy,
  Loader2,
  Coins
} from "lucide-react"

interface TransactionExecutorProps {
  contract?: any
  method?: any
  args?: any[]
  onArgsChange?: (args: any[]) => void
  onExecute: () => void
  isExecuting: boolean
  wallet: any
}

interface SimulationResult {
  success: boolean
  logs?: string[]
  error?: string
  returnValue?: any
  feeUsed?: number
  txnId?: string
}

export function BCHTransactionExecutor({
  contract,
  method,
  args = [],
  onArgsChange,
  onExecute,
  isExecuting,
  wallet
}: TransactionExecutorProps) {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [fee, setFee] = useState(1000) // in satoshis

  const simulateTransaction = async () => {
    if (!wallet) return
    setIsSimulating(true)
    setSimulationResult(null)
    try {
      // Mock simulation for BCH
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockResult: SimulationResult = {
        success: true,
        logs: [
          "Building BCH Transaction...",
          `Sender: ${wallet.address}`,
          method ? `Calling method: ${method.name}` : "Standard Payment",
          "Estimating fees...",
          "Simulation successful"
        ],
        feeUsed: 1000,
        txnId: "sim-" + Math.random().toString(36).substring(7)
      }
      setSimulationResult(mockResult)
    } catch (error) {
      setSimulationResult({
        success: false,
        error: error instanceof Error ? error.message : "Simulation failed"
      })
    } finally {
      setIsSimulating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">BCH Transaction Executor</h3>
          <p className="text-sm text-muted-foreground">
            Execute and monitor Bitcoin Cash transactions
          </p>
        </div>
        <Badge className="bg-green-600">
          {method ? "CONTRACT CALL" : "PAYMENT"}
        </Badge>
      </div>

      <Tabs defaultValue="executor" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900">
          <TabsTrigger value="executor" className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">Executor</TabsTrigger>
          <TabsTrigger value="simulation" className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="executor" className="space-y-4">
          {/* Wallet Info */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-green-400 uppercase tracking-wider">Connected Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Address:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-white">
                    {wallet?.address ? `${wallet.address.substring(0, 12)}...${wallet.address.substring(wallet.address.length - 8)}` : "Not connected"}
                  </span>
                  {wallet?.address && (
                    <Button
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-gray-800"
                      onClick={() => copyToClipboard(wallet.address)}
                    >
                      <Copy className="h-3 w-3 text-gray-400" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network:</span>
                <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-400">
                  {wallet?.network || "TESTNET"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Fee */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-green-400 uppercase tracking-wider">Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="fee" className="text-xs font-medium text-gray-300">
                  Transaction Fee (Satoshis)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="fee"
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="bg-black border-gray-800 text-white h-9 text-sm"
                  />
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    ≈ {(fee / 100000000).toFixed(8)} BCH
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={simulateTransaction}
              disabled={isSimulating || !wallet}
              variant="outline"
              className="flex-1 border-gray-800 bg-transparent text-gray-300 hover:bg-gray-800"
            >
              {isSimulating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Simulate
            </Button>
            <Button
              onClick={onExecute}
              disabled={isExecuting || !wallet}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Execute
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-4">
          {simulationResult ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-white">
                  {simulationResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  Simulation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {simulationResult.success ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground block mb-1">Fee Used:</span>
                        <span className="text-white font-mono">{simulationResult.feeUsed} sats</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">TxID (Predicted):</span>
                        <span className="text-white font-mono">{simulationResult.txnId?.substring(0, 16)}...</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-[10px] uppercase text-muted-foreground font-bold">Execution Logs:</Label>
                      <pre className="mt-1 bg-black p-3 rounded text-[11px] font-mono text-green-500 overflow-x-auto">
                        {simulationResult.logs?.map((log, i) => (
                          <div key={i}>{`> ${log}`}</div>
                        ))}
                      </pre>
                    </div>
                  </>
                ) : (
                  <Alert className="bg-red-900/20 border-red-900 text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {simulationResult.error || "Simulation failed"}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border border-dashed border-gray-800 rounded-lg">
              <Eye className="h-8 w-8 mb-3 text-gray-700" />
              <p className="text-sm text-gray-500">Run simulation to verify transaction parameters</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}