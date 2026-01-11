"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Code2, Workflow, ArrowRight, CheckCircle, Layers, Rocket, Coins, FileCode, Shield, RefreshCcw } from "lucide-react"

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  }

  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-black">
      {/* Hero Section 1: Main Introduction */}
      <section className="relative w-full overflow-hidden min-h-screen flex items-center">
        {/* Background gradient with green tones for BCH */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-background to-emerald-800/40 z-0" />

        {/* Animated shapes */}
        <motion.div
          className="absolute top-20 right-[10%] w-96 h-96 rounded-full bg-green-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute bottom-20 left-[10%] w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="container relative z-10 px-4 py-24 md:py-32 mx-auto">
          <motion.div
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-medium mb-6">
                ₿ Bitcoin Cash Smart Contracts & Privacy
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
            >
              Build Private BCH Flows{" "}
              <span className="bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-transparent">
                Instantly
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
              The world's first visual platform for anonymizing Bitcoin Cash transactions.
              Mix, Shuffle, and Split UTXOs with a powerful no-code interface.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-black font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <Link href="/workflow/private-mixer">
                  Launch Private Mixer
                  <Shield className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gray-800 text-white hover:bg-white/5">
                <Link href="/build/transactions">
                  Custom Flow Builder
                  <Zap className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
              <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                <RefreshCcw className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">CoinJoin Ready</span>
              </div>
              <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                <Shield className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Zero-Knowledge</span>
              </div>
              <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                <Workflow className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Multi-Hop</span>
              </div>
              <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                <Rocket className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Non-Custodial</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section: What You Can Build */}
      <section className="py-24 bg-gradient-to-b from-background to-green-900/10 w-full border-t border-gray-900">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 italic tracking-tighter">THE PRIVACY STACK</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic underline decoration-green-500/50">
              Advanced UTXO management for untraceable Bitcoin Cash transactions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Transaction Mixing",
                description: "Collaborative mixing rounds to increase the anonymity set of your BCH.",
                link: "/build/transactions",
                icon: RefreshCcw
              },
              {
                title: "UTXO Splitting",
                description: "Break large inputs into many smaller fingerprints to break deterministic links.",
                link: "/build/transactions",
                icon: Layers
              },
              {
                title: "Output Shuffling",
                description: "Randomize the order of outputs to defeat chain analysis software.",
                link: "/build/transactions",
                icon: Shield
              },
              {
                title: "Smart Contracts",
                description: "Build escrow and time-locked vaults with no coding required.",
                link: "/build/contracts",
                icon: FileCode
              },
              {
                title: "CashTokens (NFTs)",
                description: "Launch private NFT collections with embedded identity verification.",
                link: "/build/transactions",
                icon: Coins
              },
              {
                title: "Stealth Flows",
                description: "Chain multiple transactions over several days for maximum entropy.",
                link: "/build/transactions",
                icon: Zap
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={item.link} className="block h-full group">
                  <div className="p-8 rounded-2xl bg-black border border-gray-900 group-hover:border-green-500/50 transition-all group-hover:scale-105 h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                      <item.icon className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
