# CashLabs FLOW - Complete Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Interface Overview](#interface-overview)
4. [Building Smart Contracts (CashScript)](#building-smart-contracts)
5. [Creating Transaction Flows](#creating-transactions)
6. [Wallet Management (BCH)](#wallet-management)
7. [Node Reference](#node-reference)
8. [Code Generation](#code-generation)
9. [Deployment](#deployment)
10. [Best Practices](#best-practices)

---

## Introduction

CashLabs FLOW is a visual development platform for Bitcoin Cash (BCH) blockchain applications. It allows you to build smart contracts using CashScript and transaction flows using a node-based interface, eliminating the need to write code manually.

### What You Can Build

- **CashScript Smart Contracts**: Custom logic for spending conditions
- **Payment Transactions**: Basic BCH transfers
- **CashTokens**: Create and manage fungible tokens and NFTs natively on BCH
- **OP_RETURN Data**: Store messages or protocol data on-chain
- **Automated Flows**: Logic that waits for balances or conditions before executing

---

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/cashlabs-flow/flow.git
cd cashlabs-flow

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Steps

1. **Navigate to a Builder**: Choose `/build/contracts` for smart contracts or `/build/transactions` for transaction flows.
2. **Create a Wallet**: Click the wallet button in the top-right to generate a BCH TestNet wallet.
3. **Add Nodes**: Drag nodes from the left sidebar onto the canvas.
4. **Connect Nodes**: Click and drag from one node's output to another's input to define execution order.
5. **Configure**: Click nodes to edit their properties in the right panel.
6. **Execute**: For transactions, click "Execute" in the panel or toolbar. For contracts, copy the generated CashScript code.

---

## Interface Overview

### Main Components

#### 1. Top Bar
- **BCH Branding**: Green accents and CashLabs logo.
- **Wallet Button**: Create/manage BCH TestNet wallets and toggle the wallet panel.

#### 2. Toolbar
- **Run/Execute Button**: Execute your transaction flow.
- **Copy/Download**: Export the generated mainnet-js or CashScript code.

#### 3. Node Sidebar (Left)
Categorized nodes for BCH operations:
- **Finance**: Send BCH, Get Balance, Wait for Balance.
- **CashTokens**: Create Token, Transfer Token.
- **Data**: OP_RETURN storage.
- **Logic**: Conditions, flow control.

#### 4. Canvas (Center)
The workspace for building flows:
- **Drag & Drop** nodes from sidebar.
- **Connect ports** to define logic flow.
- **Green connections** signify the path of execution.

#### 5. Properties Panel (Right)
Appears when you select a node:
- Edit BCH addresses, amounts (in BCH or Satoshis), and token IDs.
- Configure private keys (WIF) for signing.

#### 6. Wallet Panel (Right, toggleable)
- View **BCH Address** and **Balance**.
- Switch between networks (TestNet/ChipNet).
- Send quick payments manually.
- Monitor BCH/USD price.

#### 7. Terminal (Bottom)
Shows implementation logs:
- Transaction IDs (clickable to explorer).
- Execution steps and status.
- Contract compilation results.

---

## Building Smart Contracts

### Contract Builder (`/build/contracts`)

We offer two modes for building CashScript contracts:

#### 1. Easy Mode (Noob)
Simplified blocks for common patterns:
- Signature checks
- Simple transfers
- Time-locks

#### 2. Pro Mode
Full access to the CashScript language:
- **Introspection**: Access `tx.inputs`, `tx.outputs`, etc.
- **Hashing**: `sha256`, `hash160`, `ripemd160`.
- **Locking Scripts**: Generate P2PKH or P2SH bytecode.
- **Complex Logic**: Multi-sig and covenant support.

---

## Creating Transaction Flows

### Transaction Builder (`/build/transactions`)

#### Payment Transaction
1. Drag a **Send BCH** node.
2. Set the **Receiver** address.
3. Specify the **Amount** in BCH.
4. Connect to execution start.

#### CashToken Operations
1. **Token Create**: Genesis a new token category with fungible supply or an NFT.
2. **Token Transfer**: Send existing tokens to a new owner (requires Token ID).

#### Logic Utilities
- **Wait for Balance**: Pauses execution until the wallet receives a specific amount.
- **Condition**: Branches the flow based on balance or other data.

---

## Wallet Management

### Creating a Wallet
1. Click the wallet button.
2. Select **Create BCH Wallet**.
3. A random TestNet wallet is created and saved to your browser's local storage.

**⚠️ Warning**: These wallets are for development use. Do not use them for large MainNet funds unless you have exported and secured the private key (WIF).

---

## Node Reference

### Transaction Nodes

#### Send BCH
Sends Bitcoin Cash to a recipient.
- **Input**: Receiver (CashAddr), Amount (BCH).
- **Execution**: Signs and broadcasts via mainnet-js.

#### OP_RETURN
Stores text or hex data on the blockchain.
- **Input**: Message/Data.
- **Cost**: Nominal fee (satoshi) + dust.

#### Token Create
Creating a new CashToken.
- **Type**: Fungible or NFT.
- **Optional**: Capability (Minting, Mutable, None).

---

## Code Generation

CashLabs FLOW generates **Mainnet-js** (JavaScript) for transaction flows and **CashScript** for smart contracts.

### Example Generated Contract
```cashscript
pragma cashscript ^0.9.0;

contract P2PKH(pubkey pk) {
    function spend(sig s) {
        require(checkSig(s, pk));
    }
}
```

### Example Generated Execution
```javascript
const wallet = await TestNetWallet.fromWIF(myWif);
await wallet.send([
  { cashaddr: "bitcoincash:qr...", value: 0.01, unit: "bch" }
]);
```

---

## Deployment

1. **Get TestNet Coins**: Use the Faucet link in the Wallet Panel.
2. **Build Flow**: Connect your nodes.
3. **Run**: Click the Execute button.
4. **Verify**: Click the Transaction ID in the terminal to view on the TestNet Explorer.

---

## Best Practices

1. **Use ChipNet**: For the latest CashToken features, ensure you are on a ChipNet-compatible network.
2. **Introspection**: When building contracts, use introspection (tx.outputs) for advanced covenants.
3. **Fees**: BCH fees are extremely low; usually 1 sat/byte is sufficient.
4. **Security**: Validate all addresses before sending. Use the "Simulate" feature to preview execution without spending real coins.

---

Built for the Bitcoin Cash ecosystem. ₿
