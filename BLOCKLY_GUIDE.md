# Blockly Visual CashScript Builder Guide

## Overview

The Blockly-based visual contract builder is located at `/build/contracts` and provides a drag-and-drop interface for building Bitcoin Cash (BCH) smart contracts using CashScript.

## Architecture

### Components

1. **BlockPicker.tsx** - Left column toolbox that loads and displays available blocks. Defines the code generators for CashScript.
2. **BlockPickerNoob.tsx** - Simplified version of the BlockPicker for beginners.
3. **BlockWorkspace.tsx** - Center workspace where users drag and drop blocks.
4. **CodePreview.tsx** - Right column showing generated CashScript code.

### File Structure

```
components/
├── BlockPicker.tsx       # Pro Mode Toolbox & Generators
├── BlockPickerNoob.tsx   # Easy Mode Toolbox & Generators
├── BlockWorkspace.tsx    # Main React Blockly workspace
└── CodePreview.tsx       # Code preview and export tools

app/build/contracts/
├── page.tsx              # Pro Mode page
└── noob/page.tsx         # Easy Mode page

examples/
└── blocks.json           # Block definitions (shared)
```

## Adding New Blocks

### Step 1: Define Block in JSON

Edit `examples/blocks.json` and add your block definition:

```json
{
  "type": "bch_checksig",
  "message0": "Verify Signature %1 for PubKey %2",
  "args0": [
    { "type": "input_value", "name": "SIG", "check": "Signature" },
    { "type": "input_value", "name": "PUBKEY", "check": "PubKey" }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "Enforce signature verification",
  "helpUrl": ""
}
```

### Step 2: Register CashScript Generator

Edit `components/BlockPicker.tsx` and add a generator function to the `useEffect`:

```typescript
javascriptGenerator.forBlock["bch_checksig"] = function(block: any) {
  const sig = javascriptGenerator.valueToCode(block, "SIG", Order.ATOMIC) || "s"
  const pubkey = javascriptGenerator.valueToCode(block, "PUBKEY", Order.ATOMIC) || "pk"
  const code = `require(checkSig(${sig}, ${pubkey}));\n`
  return code
}
```

### Step 3: Add to Toolbox Category

In `components/BlockPicker.tsx`, add your block to a category:

```typescript
const categories = [
  {
    name: "Verification",
    colour: "120",
    blocks: ["bch_checksig", "bch_checkdatasig"]
  }
]
```

## Generated Code

The builder generates `.cash` files compatible with the CashScript compiler.

Example output:
```cashscript
contract MyContract(pubkey pk) {
    function spend(sig s) {
        require(checkSig(s, pk));
    }
}
```

## Features

### Persistence
- Workspace automatically saves to localStorage under `vcontract:workspace`.
- Syncs between mode switches (mostly compatible).

### Export/Import
- Export generated code as `.cash` file.
- Export workspace as `.xml` file for sharing.
- "Open in Playground" sends you to the official CashScript playground.

## Best Practices

1. **Parameter Sync**: Ensure parameters defined in the "Contract Definition" block match the arguments used in logic blocks.
2. **Introspection**: Use the Introspection category for covenant logic (checking transaction outputs).
3. **Types**: CashScript is strictly typed. Ensure signatures and public keys are connected to correct ports.

---

Built for Bitcoin Cash. ₿
