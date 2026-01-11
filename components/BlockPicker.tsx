"use client"

import React, { useEffect, useState } from "react"

export default function BlockPicker({
  onToolboxXml
}: {
  onToolboxXml: (xml: string) => void
}) {
  const [toolboxXml, setToolboxXml] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ; (async () => {
      try {
        const Blockly = await import("blockly")

        // Define advanced Bitcoin Cash / CashScript blocks
        const bchBlockDefs = [
          {
            "type": "contract_class",
            "message0": "contract %1 ( %2 ) { %3 }",
            "args0": [
              { "type": "field_input", "name": "NAME", "text": "MyContract" },
              { "type": "input_value", "name": "PARAMS" },
              { "type": "input_statement", "name": "BODY" }
            ],
            "colour": 160,
            "tooltip": "Define a CashScript contract"
          },
          {
            "type": "contract_function",
            "message0": "function %1 ( %2 ) { %3 }",
            "args0": [
              { "type": "field_input", "name": "NAME", "text": "spend" },
              { "type": "input_value", "name": "PARAMS" },
              { "type": "input_statement", "name": "BODY" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230,
            "tooltip": "Define a contract function"
          },
          {
            "type": "param_pubkey",
            "message0": "pubkey %1",
            "args0": [
              { "type": "field_input", "name": "NAME", "text": "ownerPk" }
            ],
            "output": "param",
            "colour": 330,
            "tooltip": "Public key parameter"
          },
          {
            "type": "param_sig",
            "message0": "sig %1",
            "args0": [
              { "type": "field_input", "name": "NAME", "text": "s" }
            ],
            "output": "param",
            "colour": 330,
            "tooltip": "Signature parameter"
          },
          {
            "type": "param_bytes",
            "message0": "bytes %1",
            "args0": [
              { "type": "field_input", "name": "NAME", "text": "data" }
            ],
            "output": "param",
            "colour": 330,
            "tooltip": "Bytes parameter"
          },
          {
            "type": "param_bytes20",
            "message0": "bytes20 %1",
            "args0": [
              { "type": "field_input", "name": "NAME", "text": "pkh" }
            ],
            "output": "param",
            "colour": 330,
            "tooltip": "20-byte hash parameter"
          },
          {
            "type": "param_int",
            "message0": "int %1",
            "args0": [
              { "type": "field_input", "name": "NAME", "text": "amount" }
            ],
            "output": "param",
            "colour": 330,
            "tooltip": "Integer parameter"
          },
          {
            "type": "param_list",
            "message0": "%1 , %2",
            "args0": [
              { "type": "input_value", "name": "FIRST" },
              { "type": "input_value", "name": "REST" }
            ],
            "output": "param",
            "colour": 330,
            "tooltip": "Chain parameters together"
          },
          {
            "type": "require_statement",
            "message0": "require( %1 );",
            "args0": [
              { "type": "input_value", "name": "CONDITION" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 0,
            "tooltip": "Require condition to be true"
          },
          {
            "type": "check_sig",
            "message0": "checkSig( %1 , %2 )",
            "args0": [
              { "type": "input_value", "name": "SIG" },
              { "type": "input_value", "name": "PUBKEY" }
            ],
            "output": "bool",
            "colour": 0,
            "tooltip": "Verify signature with public key"
          },
          {
            "type": "check_multisig",
            "message0": "checkMultiSig( %1 , %2 )",
            "args0": [
              { "type": "input_value", "name": "SIGS" },
              { "type": "input_value", "name": "PUBKEYS" }
            ],
            "output": "bool",
            "colour": 0,
            "tooltip": "Verify multiple signatures"
          },
          {
            "type": "check_datasig",
            "message0": "checkDataSig( %1 , %2 , %3 )",
            "args0": [
              { "type": "input_value", "name": "DATASIG" },
              { "type": "input_value", "name": "MSG" },
              { "type": "input_value", "name": "PUBKEY" }
            ],
            "output": "bool",
            "colour": 0,
            "tooltip": "Verify data signature"
          },
          {
            "type": "hash160",
            "message0": "hash160( %1 )",
            "args0": [
              { "type": "input_value", "name": "DATA" }
            ],
            "output": "bytes20",
            "colour": 45,
            "tooltip": "RIPEMD160(SHA256(data))"
          },
          {
            "type": "hash256",
            "message0": "hash256( %1 )",
            "args0": [
              { "type": "input_value", "name": "DATA" }
            ],
            "output": "bytes32",
            "colour": 45,
            "tooltip": "SHA256(SHA256(data))"
          },
          {
            "type": "sha256",
            "message0": "sha256( %1 )",
            "args0": [
              { "type": "input_value", "name": "DATA" }
            ],
            "output": "bytes32",
            "colour": 45,
            "tooltip": "SHA256 hash"
          },
          {
            "type": "ripemd160",
            "message0": "ripemd160( %1 )",
            "args0": [
              { "type": "input_value", "name": "DATA" }
            ],
            "output": "bytes20",
            "colour": 45,
            "tooltip": "RIPEMD160 hash"
          },
          {
            "type": "tx_time",
            "message0": "tx.time",
            "output": "int",
            "colour": 290,
            "tooltip": "Transaction locktime"
          },
          {
            "type": "tx_age",
            "message0": "tx.age",
            "output": "int",
            "colour": 290,
            "tooltip": "Transaction age (relative locktime)"
          },
          {
            "type": "tx_inputs",
            "message0": "tx.inputs",
            "output": "array",
            "colour": 290,
            "tooltip": "Transaction inputs array"
          },
          {
            "type": "tx_outputs",
            "message0": "tx.outputs",
            "output": "array",
            "colour": 290,
            "tooltip": "Transaction outputs array"
          },
          {
            "type": "tx_input_value",
            "message0": "tx.inputs[ %1 ].value",
            "args0": [
              { "type": "field_number", "name": "INDEX", "value": 0 }
            ],
            "output": "int",
            "colour": 290,
            "tooltip": "Value of specific input"
          },
          {
            "type": "tx_output_value",
            "message0": "tx.outputs[ %1 ].value",
            "args0": [
              { "type": "field_number", "name": "INDEX", "value": 0 }
            ],
            "output": "int",
            "colour": 290,
            "tooltip": "Value of specific output"
          },
          {
            "type": "tx_output_locking",
            "message0": "tx.outputs[ %1 ].lockingBytecode",
            "args0": [
              { "type": "field_number", "name": "INDEX", "value": 0 }
            ],
            "output": "bytes",
            "colour": 290,
            "tooltip": "Locking bytecode of output"
          },
          {
            "type": "tx_input_outpoint",
            "message0": "tx.inputs[ %1 ].outpointTransactionHash",
            "args0": [
              { "type": "field_number", "name": "INDEX", "value": 0 }
            ],
            "output": "bytes32",
            "colour": 290,
            "tooltip": "Outpoint transaction hash"
          },
          {
            "type": "new_locking_p2pkh",
            "message0": "new LockingBytecodeP2PKH( %1 )",
            "args0": [
              { "type": "input_value", "name": "PKH" }
            ],
            "output": "bytes",
            "colour": 120,
            "tooltip": "Create P2PKH locking bytecode"
          },
          {
            "type": "new_locking_p2sh",
            "message0": "new LockingBytecodeP2SH( %1 )",
            "args0": [
              { "type": "input_value", "name": "HASH" }
            ],
            "output": "bytes",
            "colour": 120,
            "tooltip": "Create P2SH locking bytecode"
          },
          {
            "type": "new_locking_nulldata",
            "message0": "new LockingBytecodeNullData( %1 )",
            "args0": [
              { "type": "input_value", "name": "DATA" }
            ],
            "output": "bytes",
            "colour": 120,
            "tooltip": "Create OP_RETURN output"
          },
          {
            "type": "if_statement",
            "message0": "if ( %1 ) { %2 }",
            "args0": [
              { "type": "input_value", "name": "CONDITION" },
              { "type": "input_statement", "name": "DO" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 210,
            "tooltip": "Conditional statement"
          },
          {
            "type": "if_else_statement",
            "message0": "if ( %1 ) { %2 } else { %3 }",
            "args0": [
              { "type": "input_value", "name": "CONDITION" },
              { "type": "input_statement", "name": "DO" },
              { "type": "input_statement", "name": "ELSE" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 210,
            "tooltip": "If-else statement"
          },
          {
            "type": "comparison",
            "message0": "%1 %2 %3",
            "args0": [
              { "type": "input_value", "name": "A" },
              {
                "type": "field_dropdown", "name": "OP", "options": [
                  ["==", "=="],
                  ["!=", "!="],
                  [">", ">"],
                  ["<", "<"],
                  [">=", ">="],
                  ["<=", "<="]
                ]
              },
              { "type": "input_value", "name": "B" }
            ],
            "inputsInline": true,
            "output": "bool",
            "colour": 210,
            "tooltip": "Compare two values"
          },
          {
            "type": "logical_op",
            "message0": "%1 %2 %3",
            "args0": [
              { "type": "input_value", "name": "A" },
              {
                "type": "field_dropdown", "name": "OP", "options": [
                  ["&&", "&&"],
                  ["||", "||"]
                ]
              },
              { "type": "input_value", "name": "B" }
            ],
            "inputsInline": true,
            "output": "bool",
            "colour": 210,
            "tooltip": "Logical AND/OR"
          },
          {
            "type": "math_op",
            "message0": "%1 %2 %3",
            "args0": [
              { "type": "input_value", "name": "A" },
              {
                "type": "field_dropdown", "name": "OP", "options": [
                  ["+", "+"],
                  ["-", "-"],
                  ["*", "*"],
                  ["/", "/"],
                  ["%", "%"]
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
            "type": "int_value",
            "message0": "%1",
            "args0": [
              { "type": "field_number", "name": "NUM", "value": 0 }
            ],
            "output": "int",
            "colour": 160,
            "tooltip": "Integer value"
          },
          {
            "type": "bytes_value",
            "message0": "0x %1",
            "args0": [
              { "type": "field_input", "name": "HEX", "text": "00" }
            ],
            "output": "bytes",
            "colour": 160,
            "tooltip": "Bytes literal"
          },
          {
            "type": "bool_value",
            "message0": "%1",
            "args0": [
              {
                "type": "field_dropdown", "name": "VALUE", "options": [
                  ["true", "true"],
                  ["false", "false"]
                ]
              }
            ],
            "output": "bool",
            "colour": 160,
            "tooltip": "Boolean value"
          },
          {
            "type": "variable_ref",
            "message0": "%1",
            "args0": [
              { "type": "field_input", "name": "NAME", "text": "myVar" }
            ],
            "output": null,
            "colour": 330,
            "tooltip": "Reference a variable"
          },
          {
            "type": "bytes_length",
            "message0": "%1 .length",
            "args0": [
              { "type": "input_value", "name": "BYTES" }
            ],
            "output": "int",
            "colour": 45,
            "tooltip": "Get bytes length"
          },
          {
            "type": "bytes_split",
            "message0": "%1 .split( %2 )",
            "args0": [
              { "type": "input_value", "name": "BYTES" },
              { "type": "input_value", "name": "INDEX" }
            ],
            "output": "tuple",
            "colour": 45,
            "tooltip": "Split bytes at index"
          },
          {
            "type": "bytes_reverse",
            "message0": "%1 .reverse()",
            "args0": [
              { "type": "input_value", "name": "BYTES" }
            ],
            "output": "bytes",
            "colour": 45,
            "tooltip": "Reverse bytes"
          },
          {
            "type": "variable_declare",
            "message0": "%1 %2 = %3 ;",
            "args0": [
              {
                "type": "field_dropdown", "name": "TYPE", "options": [
                  ["int", "int"],
                  ["bytes", "bytes"],
                  ["bytes20", "bytes20"],
                  ["bytes32", "bytes32"],
                  ["bool", "bool"]
                ]
              },
              { "type": "field_input", "name": "NAME", "text": "myVar" },
              { "type": "input_value", "name": "VALUE" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 330,
            "tooltip": "Declare a variable"
          },
          {
            "type": "console_log",
            "message0": "console.log( %1 )",
            "args0": [
              { "type": "input_value", "name": "MESSAGE" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 60,
            "tooltip": "Log for debugging (simulation only)"
          }
        ]

        Blockly.defineBlocksWithJsonArray(bchBlockDefs)

        const { javascriptGenerator, Order } = await import("blockly/javascript")

        // CashScript code generators
        javascriptGenerator.forBlock["contract_class"] = function (block: any) {
          const name = block.getFieldValue("NAME")
          const params = javascriptGenerator.valueToCode(block, "PARAMS", Order.ATOMIC) || ""
          const body = javascriptGenerator.statementToCode(block, "BODY")
          return `pragma cashscript >= 0.8.0;\n\n// ${name} - Bitcoin Cash Smart Contract\n// Built with CashLabs Flow Builder\n\ncontract ${name}(${params}) {\n${body}}\n`
        }

        javascriptGenerator.forBlock["contract_function"] = function (block: any) {
          const name = block.getFieldValue("NAME")
          const params = javascriptGenerator.valueToCode(block, "PARAMS", Order.ATOMIC) || ""
          const body = javascriptGenerator.statementToCode(block, "BODY")
          return `    function ${name}(${params}) {\n${body}    }\n\n`
        }

        javascriptGenerator.forBlock["param_pubkey"] = function (block: any) {
          const name = block.getFieldValue("NAME")
          return [`pubkey ${name}`, Order.ATOMIC]
        }

        javascriptGenerator.forBlock["param_sig"] = function (block: any) {
          const name = block.getFieldValue("NAME")
          return [`sig ${name}`, Order.ATOMIC]
        }

        javascriptGenerator.forBlock["param_bytes"] = function (block: any) {
          const name = block.getFieldValue("NAME")
          return [`bytes ${name}`, Order.ATOMIC]
        }

        javascriptGenerator.forBlock["param_bytes20"] = function (block: any) {
          const name = block.getFieldValue("NAME")
          return [`bytes20 ${name}`, Order.ATOMIC]
        }

        javascriptGenerator.forBlock["param_int"] = function (block: any) {
          const name = block.getFieldValue("NAME")
          return [`int ${name}`, Order.ATOMIC]
        }

        javascriptGenerator.forBlock["param_list"] = function (block: any) {
          const first = javascriptGenerator.valueToCode(block, "FIRST", Order.ATOMIC) || ""
          const rest = javascriptGenerator.valueToCode(block, "REST", Order.ATOMIC) || ""
          return [`${first}, ${rest}`, Order.ATOMIC]
        }

        javascriptGenerator.forBlock["require_statement"] = function (block: any) {
          const condition = javascriptGenerator.valueToCode(block, "CONDITION", Order.ATOMIC) || "true"
          return `        require(${condition});\n`
        }

        javascriptGenerator.forBlock["check_sig"] = function (block: any) {
          const sig = javascriptGenerator.valueToCode(block, "SIG", Order.ATOMIC) || "s"
          const pubkey = javascriptGenerator.valueToCode(block, "PUBKEY", Order.ATOMIC) || "pk"
          return [`checkSig(${sig}, ${pubkey})`, Order.FUNCTION_CALL]
        }

        javascriptGenerator.forBlock["check_multisig"] = function (block: any) {
          const sigs = javascriptGenerator.valueToCode(block, "SIGS", Order.ATOMIC) || "[]"
          const pubkeys = javascriptGenerator.valueToCode(block, "PUBKEYS", Order.ATOMIC) || "[]"
          return [`checkMultiSig(${sigs}, ${pubkeys})`, Order.FUNCTION_CALL]
        }

        javascriptGenerator.forBlock["check_datasig"] = function (block: any) {
          const datasig = javascriptGenerator.valueToCode(block, "DATASIG", Order.ATOMIC) || "ds"
          const msg = javascriptGenerator.valueToCode(block, "MSG", Order.ATOMIC) || "msg"
          const pubkey = javascriptGenerator.valueToCode(block, "PUBKEY", Order.ATOMIC) || "pk"
          return [`checkDataSig(${datasig}, ${msg}, ${pubkey})`, Order.FUNCTION_CALL]
        }

        javascriptGenerator.forBlock["hash160"] = function (block: any) {
          const data = javascriptGenerator.valueToCode(block, "DATA", Order.ATOMIC) || ""
          return [`hash160(${data})`, Order.FUNCTION_CALL]
        }

        javascriptGenerator.forBlock["hash256"] = function (block: any) {
          const data = javascriptGenerator.valueToCode(block, "DATA", Order.ATOMIC) || ""
          return [`hash256(${data})`, Order.FUNCTION_CALL]
        }

        javascriptGenerator.forBlock["sha256"] = function (block: any) {
          const data = javascriptGenerator.valueToCode(block, "DATA", Order.ATOMIC) || ""
          return [`sha256(${data})`, Order.FUNCTION_CALL]
        }

        javascriptGenerator.forBlock["ripemd160"] = function (block: any) {
          const data = javascriptGenerator.valueToCode(block, "DATA", Order.ATOMIC) || ""
          return [`ripemd160(${data})`, Order.FUNCTION_CALL]
        }

        javascriptGenerator.forBlock["tx_time"] = function () {
          return ["tx.time", Order.MEMBER]
        }

        javascriptGenerator.forBlock["tx_age"] = function () {
          return ["tx.age", Order.MEMBER]
        }

        javascriptGenerator.forBlock["tx_inputs"] = function () {
          return ["tx.inputs", Order.MEMBER]
        }

        javascriptGenerator.forBlock["tx_outputs"] = function () {
          return ["tx.outputs", Order.MEMBER]
        }

        javascriptGenerator.forBlock["tx_input_value"] = function (block: any) {
          const index = block.getFieldValue("INDEX")
          return [`tx.inputs[${index}].value`, Order.MEMBER]
        }

        javascriptGenerator.forBlock["tx_output_value"] = function (block: any) {
          const index = block.getFieldValue("INDEX")
          return [`tx.outputs[${index}].value`, Order.MEMBER]
        }

        javascriptGenerator.forBlock["tx_output_locking"] = function (block: any) {
          const index = block.getFieldValue("INDEX")
          return [`tx.outputs[${index}].lockingBytecode`, Order.MEMBER]
        }

        javascriptGenerator.forBlock["tx_input_outpoint"] = function (block: any) {
          const index = block.getFieldValue("INDEX")
          return [`tx.inputs[${index}].outpointTransactionHash`, Order.MEMBER]
        }

        javascriptGenerator.forBlock["new_locking_p2pkh"] = function (block: any) {
          const pkh = javascriptGenerator.valueToCode(block, "PKH", Order.ATOMIC) || ""
          return [`new LockingBytecodeP2PKH(${pkh})`, Order.FUNCTION_CALL]
        }

        javascriptGenerator.forBlock["new_locking_p2sh"] = function (block: any) {
          const hash = javascriptGenerator.valueToCode(block, "HASH", Order.ATOMIC) || ""
          return [`new LockingBytecodeP2SH20(${hash})`, Order.FUNCTION_CALL]
        }

        javascriptGenerator.forBlock["new_locking_nulldata"] = function (block: any) {
          const data = javascriptGenerator.valueToCode(block, "DATA", Order.ATOMIC) || "[]"
          return [`new LockingBytecodeNullData(${data})`, Order.FUNCTION_CALL]
        }

        javascriptGenerator.forBlock["if_statement"] = function (block: any) {
          const condition = javascriptGenerator.valueToCode(block, "CONDITION", Order.ATOMIC) || "true"
          const doCode = javascriptGenerator.statementToCode(block, "DO")
          return `        if (${condition}) {\n${doCode}        }\n`
        }

        javascriptGenerator.forBlock["if_else_statement"] = function (block: any) {
          const condition = javascriptGenerator.valueToCode(block, "CONDITION", Order.ATOMIC) || "true"
          const doCode = javascriptGenerator.statementToCode(block, "DO")
          const elseCode = javascriptGenerator.statementToCode(block, "ELSE")
          return `        if (${condition}) {\n${doCode}        } else {\n${elseCode}        }\n`
        }

        javascriptGenerator.forBlock["comparison"] = function (block: any) {
          const a = javascriptGenerator.valueToCode(block, "A", Order.RELATIONAL) || "0"
          const op = block.getFieldValue("OP")
          const b = javascriptGenerator.valueToCode(block, "B", Order.RELATIONAL) || "0"
          return [`${a} ${op} ${b}`, Order.RELATIONAL]
        }

        javascriptGenerator.forBlock["logical_op"] = function (block: any) {
          const a = javascriptGenerator.valueToCode(block, "A", Order.LOGICAL_AND) || "true"
          const op = block.getFieldValue("OP")
          const b = javascriptGenerator.valueToCode(block, "B", Order.LOGICAL_AND) || "true"
          return [`${a} ${op} ${b}`, Order.LOGICAL_AND]
        }

        javascriptGenerator.forBlock["math_op"] = function (block: any) {
          const a = javascriptGenerator.valueToCode(block, "A", Order.ATOMIC) || "0"
          const op = block.getFieldValue("OP")
          const b = javascriptGenerator.valueToCode(block, "B", Order.ATOMIC) || "0"
          return [`${a} ${op} ${b}`, Order.ATOMIC]
        }

        javascriptGenerator.forBlock["int_value"] = function (block: any) {
          const num = block.getFieldValue("NUM")
          return [String(num), Order.ATOMIC]
        }

        javascriptGenerator.forBlock["bytes_value"] = function (block: any) {
          const hex = block.getFieldValue("HEX")
          return [`0x${hex}`, Order.ATOMIC]
        }

        javascriptGenerator.forBlock["bool_value"] = function (block: any) {
          const value = block.getFieldValue("VALUE")
          return [value, Order.ATOMIC]
        }

        javascriptGenerator.forBlock["variable_ref"] = function (block: any) {
          const name = block.getFieldValue("NAME")
          return [name, Order.ATOMIC]
        }

        javascriptGenerator.forBlock["bytes_length"] = function (block: any) {
          const bytes = javascriptGenerator.valueToCode(block, "BYTES", Order.MEMBER) || ""
          return [`${bytes}.length`, Order.MEMBER]
        }

        javascriptGenerator.forBlock["bytes_split"] = function (block: any) {
          const bytes = javascriptGenerator.valueToCode(block, "BYTES", Order.MEMBER) || ""
          const index = javascriptGenerator.valueToCode(block, "INDEX", Order.ATOMIC) || "0"
          return [`${bytes}.split(${index})`, Order.FUNCTION_CALL]
        }

        javascriptGenerator.forBlock["bytes_reverse"] = function (block: any) {
          const bytes = javascriptGenerator.valueToCode(block, "BYTES", Order.MEMBER) || ""
          return [`${bytes}.reverse()`, Order.FUNCTION_CALL]
        }

        javascriptGenerator.forBlock["variable_declare"] = function (block: any) {
          const type = block.getFieldValue("TYPE")
          const name = block.getFieldValue("NAME")
          const value = javascriptGenerator.valueToCode(block, "VALUE", Order.ATOMIC) || "0"
          return `        ${type} ${name} = ${value};\n`
        }

        javascriptGenerator.forBlock["console_log"] = function (block: any) {
          const message = javascriptGenerator.valueToCode(block, "MESSAGE", Order.ATOMIC) || '""'
          return `        // console.log(${message}); // Debug only\n`
        }

        const categories = [
          {
            name: "Contract",
            colour: "160",
            blocks: ["contract_class", "contract_function"]
          },
          {
            name: "Parameters",
            colour: "330",
            blocks: ["param_pubkey", "param_sig", "param_int", "param_bytes", "param_bytes20", "param_list"]
          },
          {
            name: "Security",
            colour: "0",
            blocks: ["require_statement", "check_sig", "check_multisig", "check_datasig"]
          },
          {
            name: "Hashing",
            colour: "45",
            blocks: ["hash160", "hash256", "sha256", "ripemd160"]
          },
          {
            name: "Transaction",
            colour: "290",
            blocks: ["tx_time", "tx_age", "tx_inputs", "tx_outputs", "tx_input_value", "tx_output_value", "tx_output_locking", "tx_input_outpoint"]
          },
          {
            name: "Locking Scripts",
            colour: "120",
            blocks: ["new_locking_p2pkh", "new_locking_p2sh", "new_locking_nulldata"]
          },
          {
            name: "Logic",
            colour: "210",
            blocks: ["if_statement", "if_else_statement", "comparison", "logical_op"]
          },
          {
            name: "Bytes Operations",
            colour: "45",
            blocks: ["bytes_length", "bytes_split", "bytes_reverse"]
          },
          {
            name: "Variables",
            colour: "330",
            blocks: ["variable_declare", "variable_ref"]
          },
          {
            name: "Values",
            colour: "160",
            blocks: ["int_value", "bytes_value", "bool_value", "math_op"]
          }
        ]

        const xml = `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">` +
          categories.map(cat =>
            `<category name="${cat.name}" colour="${cat.colour}">` +
            cat.blocks.map(b => `<block type="${b}"></block>`).join("") +
            `</category>`
          ).join("") +
          `</xml>`

        setToolboxXml(xml)
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
