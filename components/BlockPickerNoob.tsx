"use client"

import React, { useEffect, useState } from "react"

export default function BlockPickerNoob({
  onToolboxXml
}: {
  onToolboxXml: (xml: string) => void
}) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ; (async () => {
      try {
        const Blockly = await import("blockly")

        // Define Bitcoin Cash / CashScript blocks for noobs
        const bchBlockDefs = [
          {
            "type": "simple_contract",
            "message0": "💰 My Contract %1 %2",
            "args0": [
              { "type": "field_input", "name": "NAME", "text": "MyContract" },
              { "type": "input_statement", "name": "BODY" }
            ],
            "colour": 160,
            "tooltip": "Create a new CashScript smart contract"
          },
          {
            "type": "simple_function",
            "message0": "🎯 Function %1 %2",
            "args0": [
              { "type": "field_input", "name": "NAME", "text": "myFunction" },
              { "type": "input_statement", "name": "BODY" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230,
            "tooltip": "Create a function in your contract"
          },
          {
            "type": "simple_require",
            "message0": "✅ Require %1",
            "args0": [
              { "type": "input_value", "name": "CONDITION" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 0,
            "tooltip": "Require a condition to be true"
          },
          {
            "type": "simple_send_bch",
            "message0": "💸 Send %1 satoshis to %2",
            "args0": [
              { "type": "input_value", "name": "AMOUNT" },
              { "type": "input_value", "name": "RECIPIENT" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 120,
            "tooltip": "Send BCH to an address"
          },
          {
            "type": "simple_sender",
            "message0": "👤 Transaction Sender",
            "output": "bytes20",
            "colour": 290,
            "tooltip": "Get the public key hash of who signed this transaction"
          },
          {
            "type": "simple_tx_value",
            "message0": "💵 Transaction Amount",
            "output": "int",
            "colour": 290,
            "tooltip": "Get the value of the current output"
          },
          {
            "type": "simple_locktime",
            "message0": "⏰ Current Block Time",
            "output": "int",
            "colour": 290,
            "tooltip": "Get the current block timestamp"
          },
          {
            "type": "simple_compare",
            "message0": "%1 %2 %3",
            "args0": [
              { "type": "input_value", "name": "A" },
              {
                "type": "field_dropdown", "name": "OP", "options": [
                  ["equals", "=="],
                  ["not equals", "!="],
                  ["greater than", ">"],
                  ["less than", "<"],
                  [">=", ">="],
                  ["<=", "<="]
                ]
              },
              { "type": "input_value", "name": "B" }
            ],
            "inputsInline": true,
            "output": "Boolean",
            "colour": 210,
            "tooltip": "Compare two values"
          },
          {
            "type": "simple_if",
            "message0": "❓ If %1 then %2",
            "args0": [
              { "type": "input_value", "name": "CONDITION" },
              { "type": "input_statement", "name": "DO" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 210,
            "tooltip": "Do something if condition is true"
          },
          {
            "type": "simple_number",
            "message0": "🔢 %1",
            "args0": [
              { "type": "field_number", "name": "NUM", "value": 0 }
            ],
            "output": "int",
            "colour": 160,
            "tooltip": "A number value"
          },
          {
            "type": "simple_bytes",
            "message0": "📦 bytes: %1",
            "args0": [
              { "type": "field_input", "name": "VALUE", "text": "0x" }
            ],
            "output": "bytes",
            "colour": 160,
            "tooltip": "A bytes value (hex)"
          },
          {
            "type": "simple_pubkey_param",
            "message0": "🔑 Public Key: %1",
            "args0": [
              { "type": "field_input", "name": "NAME", "text": "ownerPk" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 330,
            "tooltip": "Define a public key parameter"
          },
          {
            "type": "simple_sig_param",
            "message0": "✍️ Signature: %1",
            "args0": [
              { "type": "field_input", "name": "NAME", "text": "sig" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 330,
            "tooltip": "Define a signature parameter"
          },
          {
            "type": "simple_check_sig",
            "message0": "🔐 Check Signature %1 with Key %2",
            "args0": [
              { "type": "input_value", "name": "SIG" },
              { "type": "input_value", "name": "PUBKEY" }
            ],
            "output": "Boolean",
            "colour": 0,
            "tooltip": "Verify a signature against a public key"
          },
          {
            "type": "simple_variable_get",
            "message0": "📌 %1",
            "args0": [
              { "type": "field_input", "name": "VAR", "text": "myVar" }
            ],
            "output": null,
            "colour": 330,
            "tooltip": "Get a variable value"
          },
          {
            "type": "simple_math",
            "message0": "%1 %2 %3",
            "args0": [
              { "type": "input_value", "name": "A" },
              {
                "type": "field_dropdown", "name": "OP", "options": [
                  ["+", "+"],
                  ["-", "-"],
                  ["×", "*"],
                  ["÷", "/"],
                  ["mod", "%"]
                ]
              },
              { "type": "input_value", "name": "B" }
            ],
            "inputsInline": true,
            "output": "int",
            "colour": 160,
            "tooltip": "Math operation"
          },
          {
            "type": "simple_and_or",
            "message0": "%1 %2 %3",
            "args0": [
              { "type": "input_value", "name": "A" },
              {
                "type": "field_dropdown", "name": "OP", "options": [
                  ["AND", "&&"],
                  ["OR", "||"]
                ]
              },
              { "type": "input_value", "name": "B" }
            ],
            "inputsInline": true,
            "output": "Boolean",
            "colour": 210,
            "tooltip": "Logical AND/OR"
          },
          {
            "type": "simple_output_value",
            "message0": "💰 Output %1 value",
            "args0": [
              { "type": "field_number", "name": "INDEX", "value": 0 }
            ],
            "output": "int",
            "colour": 290,
            "tooltip": "Get the value of a specific output"
          },
          {
            "type": "simple_output_locking",
            "message0": "🔒 Output %1 locking bytecode",
            "args0": [
              { "type": "field_number", "name": "INDEX", "value": 0 }
            ],
            "output": "bytes",
            "colour": 290,
            "tooltip": "Get the locking bytecode of a specific output"
          }
        ]

        Blockly.defineBlocksWithJsonArray(bchBlockDefs)

        const { javascriptGenerator, Order } = await import("blockly/javascript")

        // CashScript code generators
        javascriptGenerator.forBlock["simple_contract"] = function (block: any) {
          const name = block.getFieldValue("NAME")
          const body = javascriptGenerator.statementToCode(block, "BODY")
          return `pragma cashscript >= 0.8.0;\n\n// ${name} - A Bitcoin Cash Smart Contract\n// Built with CashLabs Flow Builder\n\ncontract ${name}() {\n${body}}\n`
        }

        javascriptGenerator.forBlock["simple_function"] = function (block: any) {
          const name = block.getFieldValue("NAME")
          const body = javascriptGenerator.statementToCode(block, "BODY")
          return `    function ${name}() {\n${body}    }\n\n`
        }

        javascriptGenerator.forBlock["simple_require"] = function (block: any) {
          const condition = javascriptGenerator.valueToCode(block, "CONDITION", Order.ATOMIC) || "true"
          return `        require(${condition});\n`
        }

        javascriptGenerator.forBlock["simple_send_bch"] = function (block: any) {
          const amount = javascriptGenerator.valueToCode(block, "AMOUNT", Order.ATOMIC) || "0"
          const recipient = javascriptGenerator.valueToCode(block, "RECIPIENT", Order.ATOMIC) || "tx.inputs[0].lockingBytecode"
          return `        // Send ${amount} satoshis\n        bytes25 lockingCode = new LockingBytecodeP2PKH(${recipient});\n        require(tx.outputs[0].lockingBytecode == lockingCode);\n        require(tx.outputs[0].value >= ${amount});\n`
        }

        javascriptGenerator.forBlock["simple_sender"] = function () {
          return ["tx.inputs[0].lockingBytecode", Order.MEMBER]
        }

        javascriptGenerator.forBlock["simple_tx_value"] = function () {
          return ["tx.outputs[0].value", Order.MEMBER]
        }

        javascriptGenerator.forBlock["simple_locktime"] = function () {
          return ["tx.time", Order.MEMBER]
        }

        javascriptGenerator.forBlock["simple_compare"] = function (block: any) {
          const a = javascriptGenerator.valueToCode(block, "A", Order.RELATIONAL) || "0"
          const op = block.getFieldValue("OP")
          const b = javascriptGenerator.valueToCode(block, "B", Order.RELATIONAL) || "0"
          return [`${a} ${op} ${b}`, Order.RELATIONAL]
        }

        javascriptGenerator.forBlock["simple_if"] = function (block: any) {
          const condition = javascriptGenerator.valueToCode(block, "CONDITION", Order.ATOMIC) || "true"
          const doCode = javascriptGenerator.statementToCode(block, "DO")
          return `        if (${condition}) {\n${doCode}        }\n`
        }

        javascriptGenerator.forBlock["simple_number"] = function (block: any) {
          const num = block.getFieldValue("NUM")
          return [String(num), Order.ATOMIC]
        }

        javascriptGenerator.forBlock["simple_bytes"] = function (block: any) {
          const value = block.getFieldValue("VALUE")
          return [`${value}`, Order.ATOMIC]
        }

        javascriptGenerator.forBlock["simple_pubkey_param"] = function (block: any) {
          const name = block.getFieldValue("NAME")
          return `    // Parameter: pubkey ${name}\n`
        }

        javascriptGenerator.forBlock["simple_sig_param"] = function (block: any) {
          const name = block.getFieldValue("NAME")
          return `    // Parameter: sig ${name}\n`
        }

        javascriptGenerator.forBlock["simple_check_sig"] = function (block: any) {
          const sig = javascriptGenerator.valueToCode(block, "SIG", Order.ATOMIC) || "s"
          const pubkey = javascriptGenerator.valueToCode(block, "PUBKEY", Order.ATOMIC) || "pk"
          return [`checkSig(${sig}, ${pubkey})`, Order.FUNCTION_CALL]
        }

        javascriptGenerator.forBlock["simple_variable_get"] = function (block: any) {
          const varName = block.getFieldValue("VAR")
          return [varName, Order.ATOMIC]
        }

        javascriptGenerator.forBlock["simple_math"] = function (block: any) {
          const a = javascriptGenerator.valueToCode(block, "A", Order.ATOMIC) || "0"
          const op = block.getFieldValue("OP")
          const b = javascriptGenerator.valueToCode(block, "B", Order.ATOMIC) || "0"
          return [`(${a} ${op} ${b})`, Order.ATOMIC]
        }

        javascriptGenerator.forBlock["simple_and_or"] = function (block: any) {
          const a = javascriptGenerator.valueToCode(block, "A", Order.LOGICAL_AND) || "true"
          const op = block.getFieldValue("OP")
          const b = javascriptGenerator.valueToCode(block, "B", Order.LOGICAL_AND) || "true"
          return [`(${a} ${op} ${b})`, Order.LOGICAL_AND]
        }

        javascriptGenerator.forBlock["simple_output_value"] = function (block: any) {
          const index = block.getFieldValue("INDEX")
          return [`tx.outputs[${index}].value`, Order.MEMBER]
        }

        javascriptGenerator.forBlock["simple_output_locking"] = function (block: any) {
          const index = block.getFieldValue("INDEX")
          return [`tx.outputs[${index}].lockingBytecode`, Order.MEMBER]
        }

        const categories = [
          {
            name: "🎯 Start Here",
            colour: "160",
            blocks: ["simple_contract", "simple_function"]
          },
          {
            name: "🔐 Security",
            colour: "0",
            blocks: ["simple_require", "simple_check_sig", "simple_pubkey_param", "simple_sig_param"]
          },
          {
            name: "💰 Money",
            colour: "120",
            blocks: ["simple_send_bch", "simple_output_value", "simple_output_locking"]
          },
          {
            name: "❓ Logic",
            colour: "210",
            blocks: ["simple_if", "simple_compare", "simple_and_or"]
          },
          {
            name: "🔧 Transaction Data",
            colour: "290",
            blocks: ["simple_sender", "simple_tx_value", "simple_locktime"]
          },
          {
            name: "📝 Values",
            colour: "160",
            blocks: ["simple_number", "simple_bytes", "simple_variable_get", "simple_math"]
          }
        ]

        const xml = `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">` +
          categories.map(cat =>
            `<category name="${cat.name}" colour="${cat.colour}">` +
            cat.blocks.map(b => `<block type="${b}"></block>`).join("") +
            `</category>`
          ).join("") +
          `</xml>`

        onToolboxXml(xml)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load blocks:", error)
        setLoading(false)
      }
    })()
  }, [onToolboxXml])

  return null
}
