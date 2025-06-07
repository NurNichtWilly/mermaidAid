#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { translateToMermaid } from '../translator/mermaid-translator';

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
MERMAIDAID COMPACT SYNTAX EXAMPLES:

=== ULTRA-COMPACT FLOWCHART ===
flow
@ start: Begin
start -> process -> ? decision -> ! end
decision -> error: no
error -> start: retry

=== SYMBOL FLOWCHART ===  
flow
@ login: User Login
login -> auth: authenticate  
? auth: Valid?
auth -> home: yes
auth -> error: no
! home: Dashboard
error -> login: try again

=== INLINE CONNECTIONS ===
flow
start -> validate -> decision -> end
decision -> error: failed
error -> start: retry

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

SYMBOLS:
@ or ○  = start node
! or ●  = end node  
? or <> = decision node
□       = process node (default)

SHORTCUTS:
flow    = flowchart
seq     = sequence
->      = connection
: label = add label (optional quotes)
`);
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '-h':
      case '--help':
        options.help = true;
        break;
      case '-e':
      case '--examples':
        options.examples = true;
        break;
      case '-o':
      case '--output':
        if (i + 1 < args.length) {
          options.output = args[++i];
        } else {
          console.error('Error: --output requires a filename');
          process.exit(1);
        }
        break;
      default:
        if (!arg.startsWith('-')) {
          options.input = arg;
        }
        break;
    }
  }
  
  return options;
}

async function readInput(inputFile?: string): Promise<string> {
  if (inputFile) {
    if (!fs.existsSync(inputFile)) {
      console.error(`Error: File '${inputFile}' not found`);
      process.exit(1);
    }
    return fs.readFileSync(inputFile, 'utf-8');
  } else {
    // Read from stdin
    return new Promise((resolve, reject) => {
      let data = '';
      process.stdin.setEncoding('utf-8');
      
      process.stdin.on('data', chunk => {
        data += chunk;
      });
      
      process.stdin.on('end', () => {
        resolve(data);
      });
      
      process.stdin.on('error', reject);
    });
  }
}

function writeOutput(content: string, outputFile?: string): void {
  if (outputFile) {
    fs.writeFileSync(outputFile, content);
    console.log(`Output written to ${outputFile}`);
  } else {
    console.log(content);
  }
}

async function main(): Promise<void> {
  const options = parseArgs();
  
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
