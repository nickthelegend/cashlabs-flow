# CashLabs FLOW - Visual Bitcoin Cash Smart Contract & Transaction Builder

A visual, node-based development environment for building and deploying Bitcoin Cash smart contracts and transactions without writing code. Powered by **CashScript** and **mainnet-js**.

## Overview

CashLabs FLOW is a powerful visual programming platform that enables developers to create Bitcoin Cash (BCH) blockchain applications using an intuitive drag-and-drop interface. Build smart contracts, compose transactions, and deploy to the BCH network - all through a visual flow builder.

## Key Features

- **Visual Flow Builder**: Drag-and-drop interface for building BCH transaction paths
- **CashScript Smart Contract Builder**: Create and deploy smart contracts visually using CashScript blocks
- **CashToken Support**: Native support for creating and transferring fungible tokens and NFTs
- **Live Code Generation**: See CashScript and mainnet-js code generated in real-time
- **Wait for Balance**: Unique utility nodes to handle asynchronous transaction flows
- **TestNet Support**: Built-in support for ChipNet / TestNet4
- **Built-in BCH Wallet**: Create and manage TestNet wallets locally

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **Flow Editor**: React Flow
- **Visual Programming**: Blockly (for Smart Contracts)
- **Blockchain**: mainnet-js
- **Smart Contracts**: CashScript
- **Code Generation**: Custom AST-based generator

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/cashlabs/flow.git
   cd cashlabs-flow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── build/
│   │   ├── contracts/    # CashScript visual builder (Pro/Noob)
│   │   └── transactions/ # Transaction flow builder
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page with BCH branding
├── components/
│   ├── flow-builder.tsx  # Main React Flow editor
│   ├── node-sidebar.tsx  # Node palette for BCH operations
│   ├── wallet-panel.tsx  # BCH Wallet interface (mainnet-js)
│   ├── BlockPicker.tsx   # Blockly blocks for CashScript
│   └── nodes/            # custom React Flow node components
├── lib/
│   └── code-generator.ts # BCH/mainnet-js code generation logic
└── public/               # Static assets and logos
```

## Quick Start

1. **Create a BCH Wallet**: Open the Transaction builder and click the wallet button to generate a TestNet wallet.
2. **Build a Flow**: Drag BCH nodes from the sidebar onto the canvas (Send BCH, CashToken Create, etc.).
3. **Connect Nodes**: Link nodes to define the execution order and logic.
4. **Deploy Contract**: Use the Contract Builder to create CashScript logic visually and download the `.cash` file.
5. **Run**: Execute transaction flows directly from the builder.

## Documentation

- [CashScript Docs](https://cashscript.org/)
- [Mainnet-js Docs](https://mainnet.cash/)
- [Bitcoin Cash SDK Guide](./docs/tutorial/README.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with 💚 for the Bitcoin Cash community.
