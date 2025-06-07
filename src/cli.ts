#!/usr/bin/env node

import * as fs from 'fs';
import { translateToMermaid } from './translator/mermaid-translator';

interface CliOptions {
  input?: string;
  output?: string;
  help?: boolean;
  examples?: boolean;
}

function showHelp(): void {
  console.log(`
MermaidAid - Simplified Mermaid Diagram Generator

USAGE:
  mermaidaid [OPTIONS] [INPUT_FILE]

OPTIONS:
  -o, --output <file>    Output file (default: stdout)
  -h, --help            Show this help message
  -e, --examples        Show syntax examples

EXAMPLES:
  mermaidaid diagram.mad
  mermaidaid input.mad -o output.mmd
  echo "flowchart\\nstart begin\\nbegin -> end" | mermaidaid
`);
}

function showExamples(): void {
  console.log(`
MERMAIDAID ULTRA-COMPACT SYNTAX EXAMPLES:

=== CHAINED CONNECTIONS ===
flow
@ start: Begin
start -> validate -> ? decision -> ! success
decision -> error: failed
error -> start: retry

=== SMART NODE INFERENCE ===
flow
login -> validate -> decision -> success
decision -> failure: rejected  
failure -> login: retry

=== SYMBOL FLOWCHART ===  
flow
@ login: User Login
login -> auth: authenticate  
? auth: Valid?
auth -> home: yes
auth -> error: no
! home: Dashboard
error -> login: try again

=== NATURAL LANGUAGE ===
flow
@ begin: User opens app
begin -> authenticate -> ? valid: Check credentials?
valid -> dashboard: yes
valid -> error: no

=== COMPACT SEQUENCE ===
seq
user -> app: login
app -> db: check user
db -> app: user found
app -> user: welcome

=== SIMPLE CLASS ===
class
User
Order  
Product

ENHANCED FEATURES:
✓ Chain connections: A -> B -> C -> D
✓ Smart node inference from names
✓ Comment support (// comments)
✓ Multi-word labels without quotes
✓ Enhanced symbol support

SYMBOLS:
@ or ○  = start node (rounded)
! or ●  = end node (rounded)
? or <> = decision node (diamond)  
□       = process node (rectangle)

SHORTCUTS:
flow    = flowchart
seq     = sequence  
->      = connection
: label = add label (quotes optional)

SMART INFERENCE:
- Names with "start", "begin", "init" → start nodes
- Names with "end", "finish", "success", "done" → end nodes
- Names with "check", "valid", "decide", "?" → decision nodes
- Everything else → process nodes
`);
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {};
  let i = 0;
  
  while (i < args.length) {
    const arg = args[i];
    
    if (arg === '-h' || arg === '--help') {
      options.help = true;
    } else if (arg === '-e' || arg === '--examples') {
      options.examples = true;
    } else if (arg === '-o' || arg === '--output') {
      i++;
      if (i < args.length) {
        options.output = args[i];
      } else {
        console.error('Error: --output requires a filename');
        process.exit(1);
      }
    } else if (!arg.startsWith('-')) {
      if (!options.input) {
        options.input = arg;
      }
    } else {
      console.error(`Error: Unknown option ${arg}`);
      process.exit(1);
    }
    
    i++;
  }
  
  return options;
}

async function readInput(inputFile?: string): Promise<string> {
  if (inputFile) {
    try {
      return fs.readFileSync(inputFile, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read input file '${inputFile}': ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    // Read from stdin
    let input = '';
    for await (const chunk of process.stdin) {
      input += chunk;
    }
    return input;
  }
}

function writeOutput(content: string, outputFile?: string): void {
  if (outputFile) {
    try {
      fs.writeFileSync(outputFile, content, 'utf8');
      console.error(`Output written to ${outputFile}`);
    } catch (error) {
      throw new Error(`Failed to write output file '${outputFile}': ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    process.stdout.write(content);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  if (options.help) {
    showHelp();
    return;
  }
  
  if (options.examples) {
    showExamples();
    return;
  }
  
  try {
    const input = await readInput(options.input);
    
    if (!input.trim()) {
      console.error('Error: No input provided');
      process.exit(1);
    }
    
    const mermaidCode = translateToMermaid(input);
    writeOutput(mermaidCode, options.output);
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}
