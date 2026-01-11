"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, TerminalIcon, Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface TerminalProps {
  isOpen: boolean
  onClose: () => void
}

export function Terminal({ isOpen, onClose }: TerminalProps) {
  const [output] = useState([
    "CashLabs FLOW Terminal v1.0.0",
    "Ready to compile and deploy your Bitcoin Cash smart contracts",
    "BCH TestNet active",
    "",
    "> Waiting for input...",
  ])

  const [code] = useState(`pragma cashscript ^0.9.0;

contract CashTransfer(pubkey pk) {
    function spend(sig s) {
        require(checkSig(s, pk));
    }
}`)

  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast({
        title: "Code Copied",
        description: "CashScript code has been copied to clipboard",
        duration: 2000,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy code to clipboard",
        duration: 2000,
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 h-80 bg-[#0a0a0a]/98 backdrop-blur-lg border-t border-green-500/30 z-40">
      <Card className="w-full h-full bg-transparent border-none rounded-none">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-gray-800">
          <CardTitle className="text-white flex items-center text-sm">
            <TerminalIcon className="h-4 w-4 mr-2 text-green-500" />
            BCH Console
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-4rem)]">
          <Tabs defaultValue="output" className="h-full">
            <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-gray-800">
              <TabsList className="bg-gray-900 border border-gray-800">
                <TabsTrigger value="output" className="text-xs data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">
                  Output
                </TabsTrigger>
                <TabsTrigger value="code" className="text-xs data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">
                  CashScript
                </TabsTrigger>
              </TabsList>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="text-gray-400 hover:text-white"
                disabled={copied}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1 text-xs">{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>

            <TabsContent value="output" className="h-[calc(100%-3rem)] m-0">
              <ScrollArea className="h-full p-4">
                <div className="font-mono text-sm text-green-400 space-y-1">
                  {output.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="code" className="h-[calc(100%-3rem)] m-0">
              <div className="h-full bg-black">
                <MonacoEditor code={code} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function MonacoEditor({ code }: { code: string }) {
  return (
    <div className="h-full w-full relative">
      <div className="absolute inset-0 bg-black">
        <pre className="h-full w-full p-4 text-sm text-gray-300 font-mono overflow-auto bg-black border-none outline-none resize-none">
          <code className="language-typescript">{code}</code>
        </pre>
      </div>
      <style jsx>{`
        pre {
          background: #000 !important;
          color: #e5e7eb;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 13px;
          line-height: 1.5;
          tab-size: 2;
        }
        
        .language-typescript .keyword {
          color: #569cd6;
        }
        
        .language-typescript .string {
          color: #ce9178;
        }
        
        .language-typescript .comment {
          color: #6a9955;
        }
        
        .language-typescript .function {
          color: #dcdcaa;
        }
        
        .language-typescript .class-name {
          color: #4ec9b0;
        }
        
        .language-typescript .number {
          color: #b5cea8;
        }
      `}</style>
    </div>
  )
}
