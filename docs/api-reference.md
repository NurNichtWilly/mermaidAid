# API Reference

Complete API documentation for using MermaidAid programmatically.

## Table of Contents

1. [Main API](#main-api)
2. [Parser API](#parser-api)
3. [Translator API](#translator-api)
4. [Type Definitions](#type-definitions)
5. [Error Handling](#error-handling)
6. [Examples](#examples)

## Main API

### `translateToMermaid(input: string): string`

The primary function for converting MermaidAid syntax to Mermaid diagrams.

**Parameters:**
- `input` (string): The MermaidAid source code to translate

**Returns:**
- `string`: Generated Mermaid diagram code

**Throws:**
- `ParseError`: When the input syntax is invalid
- `TranslationError`: When translation fails

**Example:**
```typescript
import { translateToMermaid } from 'mermaidaid';

const madSource = `
flow
@ start: Begin Process
start -> validate -> ? decision -> ! end
decision -> error: failed
error -> start: retry
`;

try {
  const mermaidCode = translateToMermaid(madSource);
  console.log(mermaidCode);
} catch (error) {
  console.error('Translation failed:', error.message);
}
```

### `translateFile(inputPath: string, outputPath?: string): Promise<string>`

Translate a MermaidAid file to Mermaid format.

**Parameters:**
- `inputPath` (string): Path to the `.mad` file
- `outputPath` (string, optional): Path for output file. If not provided, returns the content

**Returns:**
- `Promise<string>`: Generated Mermaid diagram code

**Example:**
```typescript
import { translateFile } from 'mermaidaid';

// Translate and save to file
await translateFile('input.mad', 'output.mmd');

// Translate and get content
const mermaidCode = await translateFile('input.mad');
```

## Parser API

### `parse(input: string): ASTNode`

Parse MermaidAid source code into an Abstract Syntax Tree.

**Parameters:**
- `input` (string): MermaidAid source code

**Returns:**
- `ASTNode`: Root node of the parsed syntax tree

**Example:**
```typescript
import { parse } from 'mermaidaid/parser';

const ast = parse(`
flow
start -> end
`);
```

### `tokenize(input: string): Token[]`

Tokenize MermaidAid source code into an array of tokens.

**Parameters:**
- `input` (string): MermaidAid source code

**Returns:**
- `Token[]`: Array of lexical tokens

**Example:**
```typescript
import { tokenize } from 'mermaidaid/parser';

const tokens = tokenize('start -> end');
// Returns: [
//   { type: 'IDENTIFIER', value: 'start' },
//   { type: 'ARROW', value: '->' },
//   { type: 'IDENTIFIER', value: 'end' }
// ]
```

## Translator API

### `translateAST(ast: ASTNode): string`

Translate an Abstract Syntax Tree to Mermaid format.

**Parameters:**
- `ast` (ASTNode): Parsed syntax tree

**Returns:**
- `string`: Generated Mermaid diagram code

**Example:**
```typescript
import { parse, translateAST } from 'mermaidaid';

const ast = parse('flow\nstart -> end');
const mermaid = translateAST(ast);
```

### `MermaidTranslator`

Class for translating AST nodes to Mermaid syntax.

#### Methods

##### `translate(ast: ASTNode): string`

Main translation method.

##### `translateFlowchart(nodes: FlowchartNode[]): string`

Translate flowchart-specific nodes.

##### `translateSequence(nodes: SequenceNode[]): string`

Translate sequence diagram nodes.

##### `translateClass(nodes: ClassNode[]): string`

Translate class diagram nodes.

## Type Definitions

### `DiagramType`

```typescript
type DiagramType = 'flowchart' | 'sequence' | 'class';
```

### `NodeType`

```typescript
type NodeType = 'start' | 'end' | 'process' | 'decision';
```

### `Token`

```typescript
interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}
```

### `ASTNode`

```typescript
interface ASTNode {
  type: string;
  children?: ASTNode[];
  value?: string;
  metadata?: Record<string, any>;
}
```

### `Connection`

```typescript
interface Connection {
  from: string;
  to: string;
  label?: string;
  type: 'arrow' | 'bidirectional';
}
```

### `Node`

```typescript
interface Node {
  id: string;
  label?: string;
  type: NodeType;
  symbol?: string;
}
```

## Error Handling

### `ParseError`

Thrown when parsing fails due to syntax errors.

**Properties:**
- `message` (string): Error description
- `line` (number): Line number where error occurred
- `column` (number): Column number where error occurred

### `TranslationError`

Thrown when translation from AST to Mermaid fails.

**Properties:**
- `message` (string): Error description
- `node` (ASTNode): AST node that caused the error

### `ValidationError`

Thrown when input validation fails.

**Properties:**
- `message` (string): Error description
- `field` (string): Field that failed validation

## Examples

### Basic Usage

```typescript
import { translateToMermaid } from 'mermaidaid';

// Simple flowchart
const flowchart = translateToMermaid(`
flow
@ start -> process -> ? decision -> ! end
decision -> error: failed -> start: retry
`);

// Sequence diagram
const sequence = translateToMermaid(`
seq
user -> app: request
app -> db: query
db -> app: data
app -> user: response
`);

// Class diagram
const classdiagram = translateToMermaid(`
class
User
Account
User -> Account: has
`);
```

### Advanced Usage

```typescript
import { parse, translateAST, MermaidTranslator } from 'mermaidaid';

// Custom translation with preprocessing
const source = `
flow
// Custom processing flow
@ start: Begin
start -> validate: Validate input
validate -> ? ok: Is valid?
ok -> process: yes -> ! done: Complete
ok -> error: no -> start: retry
`;

// Parse to AST
const ast = parse(source);

// Custom translator with options
const translator = new MermaidTranslator({
  theme: 'dark',
  direction: 'TB'
});

const mermaid = translator.translate(ast);
```

### File Processing

```typescript
import { translateFile } from 'mermaidaid';
import { promises as fs } from 'fs';

async function processDirectory(dirPath: string) {
  const files = await fs.readdir(dirPath);
  
  for (const file of files) {
    if (file.endsWith('.mad')) {
      const inputPath = `${dirPath}/${file}`;
      const outputPath = `${dirPath}/${file.replace('.mad', '.mmd')}`;
      
      try {
        await translateFile(inputPath, outputPath);
        console.log(`Translated: ${file}`);
      } catch (error) {
        console.error(`Failed to translate ${file}:`, error.message);
      }
    }
  }
}
```

### Error Handling

```typescript
import { translateToMermaid, ParseError, TranslationError } from 'mermaidaid';

function safeTranslate(source: string): string | null {
  try {
    return translateToMermaid(source);
  } catch (error) {
    if (error instanceof ParseError) {
      console.error(`Parse error at line ${error.line}: ${error.message}`);
    } else if (error instanceof TranslationError) {
      console.error(`Translation error: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${error.message}`);
    }
    return null;
  }
}
```

## Integration Examples

### Express.js Server

```typescript
import express from 'express';
import { translateToMermaid } from 'mermaidaid';

const app = express();
app.use(express.json());

app.post('/translate', (req, res) => {
  try {
    const { source } = req.body;
    const mermaid = translateToMermaid(source);
    res.json({ success: true, mermaid });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});
```

### React Component

```tsx
import React, { useState } from 'react';
import { translateToMermaid } from 'mermaidaid';

function DiagramEditor() {
  const [source, setSource] = useState('');
  const [mermaid, setMermaid] = useState('');
  const [error, setError] = useState('');

  const handleTranslate = () => {
    try {
      const result = translateToMermaid(source);
      setMermaid(result);
      setError('');
    } catch (err) {
      setError(err.message);
      setMermaid('');
    }
  };

  return (
    <div>
      <textarea 
        value={source}
        onChange={(e) => setSource(e.target.value)}
        placeholder="Enter MermaidAid code..."
      />
      <button onClick={handleTranslate}>Translate</button>
      {error && <div className="error">{error}</div>}
      {mermaid && <pre>{mermaid}</pre>}
    </div>
  );
}
```

## Configuration

### Translator Options

```typescript
interface TranslatorOptions {
  theme?: 'default' | 'dark' | 'forest' | 'neutral';
  direction?: 'TB' | 'BT' | 'LR' | 'RL';
  flowchart?: {
    nodeSpacing?: number;
    rankSpacing?: number;
  };
  sequence?: {
    actorMargin?: number;
    boxMargin?: number;
  };
}
```

### Global Configuration

```typescript
import { configure } from 'mermaidaid';

configure({
  theme: 'dark',
  direction: 'LR',
  validation: {
    strict: true,
    warnings: true
  }
});
```

## Best Practices

1. **Error Handling**: Always wrap translation calls in try-catch blocks
2. **Validation**: Validate input before translation for better error messages
3. **Caching**: Cache parsed ASTs for repeated translations of the same source
4. **Async Operations**: Use async methods for file operations
5. **Type Safety**: Use TypeScript for better development experience

## Performance Considerations

- **Large Diagrams**: For diagrams with 100+ nodes, consider breaking them into smaller parts
- **Batch Processing**: Use batch operations for multiple files
- **Memory Usage**: Parser creates AST in memory; consider streaming for very large files
- **Caching**: Cache compiled results for frequently used diagrams

## Version Compatibility

- **Node.js**: Requires Node.js 16+
- **TypeScript**: Compatible with TypeScript 4.0+
- **Browser**: ES2020+ for browser usage
- **Mermaid**: Generates code compatible with Mermaid 9.0+
