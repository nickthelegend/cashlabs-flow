"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Code2, Workflow, ArrowRight, CheckCircle, Layers, Rocket, Coins, FileCode } from "lucide-react"

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
    <div className="flex flex-col w-full overflow-x-hidden">
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
                ₿ Bitcoin Cash Smart Contracts
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
            >
              Build BCH Contracts{" "}
              <span className="bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-transparent">
                Without Code
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
              CashLabs Flow is the visual platform for creating CashScript smart contracts and BCH transactions.
              No coding experience required. Deploy in minutes.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 text-white font-semibold">
                <Link href="/build/contracts">
                  Build Contracts
                  <FileCode className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                <Link href="/build/transactions">
                  Build Transactions
                  <Coins className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-4">
              <Button asChild variant="outline" size="lg" className="border-green-500/30 text-green-300 hover:bg-green-500/10">
                <Link href="/build/contracts/noob">
                  🎮 Easy Mode (For Beginners)
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Hero Section 2: How It Works */}
      <section id="how-it-works" className="py-24 bg-background/50 w-full">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How CashLabs Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create powerful Bitcoin Cash smart contracts with an intuitive visual interface
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Drag Components",
                description: "Select from pre-built CashScript components and drag them onto your canvas.",
                icon: Layers,
              },
              {
                step: "02",
                title: "Configure Logic",
                description: "Set parameters, conditions, and spending rules using the visual editor.",
                icon: Workflow,
              },
              {
                step: "03",
                title: "Deploy to BCH",
                description: "Generate CashScript code and deploy your contract to Bitcoin Cash.",
                icon: Rocket,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative"
              >
                <div className="flex flex-col h-full p-8 rounded-2xl bg-card border border-border hover:border-green-500/50 transition-colors">
                  <div className="text-5xl font-bold text-green-500/20 mb-4">{item.step}</div>
                  <item.icon className="h-8 w-8 text-green-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section: What You Can Build */}
      <section className="py-24 bg-gradient-to-b from-background to-green-900/10 w-full">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What You Can Build</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              CashLabs supports the full power of Bitcoin Cash and CashScript
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "BCH Transactions",
                description: "Send and receive Bitcoin Cash with visual flow building",
                link: "/build/transactions",
              },
              {
                title: "CashTokens",
                description: "Create and transfer fungible tokens and NFTs on BCH",
                link: "/build/transactions",
              },
              {
                title: "Escrow Contracts",
                description: "Build trustless 2-of-3 multisig escrow solutions",
                link: "/build/contracts",
              },
              {
                title: "Time-Locked Vaults",
                description: "Create contracts with time-based spending conditions",
                link: "/build/contracts",
              },
              {
                title: "OP_RETURN Data",
                description: "Store messages and data permanently on-chain",
                link: "/build/transactions",
              },
              {
                title: "Custom Contracts",
                description: "Build any CashScript contract with visual blocks",
                link: "/build/contracts",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={item.link} className="block h-full">
                  <div className="p-6 rounded-xl bg-card border border-border hover:border-green-500/50 transition-all hover:scale-105 h-full">
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section 3: Key Features & Benefits */}
      <section className="py-24 bg-background w-full">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose CashLabs?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The easiest way to build and deploy on Bitcoin Cash
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Code2,
                title: "No Code Required",
                description:
                  "Build complex CashScript contracts without writing code. Our visual editor handles all the complexity.",
              },
              {
                icon: Zap,
                title: "Powered by CashScript",
                description: "Generates production-ready CashScript code that you can audit, modify, and deploy.",
              },
              {
                icon: CheckCircle,
                title: "Low Fees",
                description:
                  "Bitcoin Cash has some of the lowest transaction fees in crypto. Deploy contracts for pennies.",
              },
              {
                icon: Workflow,
                title: "Full CashToken Support",
                description:
                  "Create fungible tokens and NFTs natively on BCH with CashTokens support.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border hover:border-green-500/50 transition-colors group"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-600/10 w-fit mb-4 group-hover:from-green-500/20 group-hover:to-emerald-600/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-900/50 to-emerald-800/50 w-full">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Build on BCH?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start creating Bitcoin Cash smart contracts and transactions today. No experience necessary.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 text-white font-semibold">
                <Link href="/build/contracts">
                  Start Building Contracts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black font-semibold">
                <Link href="/build/transactions">
                  Build Transactions
                  <Coins className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
