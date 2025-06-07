// Types for the simplified mermaid language

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export enum TokenType {
  // Diagram types
  FLOWCHART = 'FLOWCHART',
  SEQUENCE = 'SEQUENCE',
  CLASS = 'CLASS',
  
  // Node types
  START = 'START',
  END = 'END',
  PROCESS = 'PROCESS',
  DECISION = 'DECISION',
  
  // Identifiers and literals
  IDENTIFIER = 'IDENTIFIER',
  STRING = 'STRING',
  
  // Operators
  ARROW = 'ARROW',
  COLON = 'COLON',
  
  // Special
  NEWLINE = 'NEWLINE',
  EOF = 'EOF'
}

export interface ASTNode {
  type: string;
}

export interface DiagramNode extends ASTNode {
  type: 'diagram';
  diagramType: 'flowchart' | 'sequence' | 'class';
  statements: StatementNode[];
}

export interface StatementNode extends ASTNode {
  type: string;
}

export interface NodeDefinitionStatement extends StatementNode {
  type: 'nodeDefinition';
  nodeType: string;
  id: string;
  label?: string;
}

export interface ConnectionStatement extends StatementNode {
  type: 'connection';
  from: string;
  to: string;
  label?: string;
}

export interface SequenceStatement extends StatementNode {
  type: 'sequence';
  from: string;
  to: string;
  message: string;
}

export interface ClassStatement extends StatementNode {
  type: 'class';
  name: string;
}

// Lexer implementation
export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(input: string) {
    this.input = input;
  }

  private peek(): string {
    if (this.position >= this.input.length) {
      return '';
    }
    return this.input[this.position];
  }

  private advance(): string {
    const char = this.peek();
    this.position++;
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  private skipWhitespace(): void {
    while (this.peek() && /\s/.test(this.peek()) && this.peek() !== '\n') {
      this.advance();
    }
  }

  private readString(): string {
    let value = '';
    this.advance(); // Skip opening quote
    
    while (this.peek() && this.peek() !== '"') {
      if (this.peek() === '\\') {
        this.advance(); // Skip escape character
        const escaped = this.advance();
        switch (escaped) {
          case 'n': value += '\n'; break;
          case 't': value += '\t'; break;
          case 'r': value += '\r'; break;
          case '\\': value += '\\'; break;
          case '"': value += '"'; break;
          default: value += escaped; break;
        }
      } else {
        value += this.advance();
      }
    }
    
    this.advance(); // Skip closing quote
    return value;
  }

  private readIdentifier(): string {
    let value = '';
    while (this.peek() && /[a-zA-Z0-9_]/.test(this.peek())) {
      value += this.advance();
    }
    return value;
  }

  private readArrow(): string {
    let value = '';
    if (this.peek() === '-') {
      value += this.advance();
      if (this.peek() === '>') {
        value += this.advance();
      }
    }
    return value;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.position < this.input.length) {
      this.skipWhitespace();

      if (this.position >= this.input.length) {
        break;
      }

      const char = this.peek();
      const startLine = this.line;
      const startColumn = this.column;

      if (char === '\n') {
        this.advance();
        tokens.push({
          type: TokenType.NEWLINE,
          value: '\n',
          line: startLine,
          column: startColumn
        });
      } else if (char === '"') {
        const value = this.readString();
        tokens.push({
          type: TokenType.STRING,
          value,
          line: startLine,
          column: startColumn
        });
      } else if (char === ':') {
        this.advance();
        tokens.push({
          type: TokenType.COLON,
          value: ':',
          line: startLine,
          column: startColumn
        });
      } else if (char === '-' && this.input[this.position + 1] === '>') {
        const value = this.readArrow();
        tokens.push({
          type: TokenType.ARROW,
          value,
          line: startLine,
          column: startColumn
        });
      } else if (/[a-zA-Z_]/.test(char)) {
        const value = this.readIdentifier();
        let tokenType = TokenType.IDENTIFIER;

        // Check for keywords
        switch (value.toLowerCase()) {
          case 'flowchart': tokenType = TokenType.FLOWCHART; break;
          case 'sequence': tokenType = TokenType.SEQUENCE; break;
          case 'class': tokenType = TokenType.CLASS; break;
          case 'start': tokenType = TokenType.START; break;
          case 'end': tokenType = TokenType.END; break;
          case 'process': tokenType = TokenType.PROCESS; break;
          case 'decision': tokenType = TokenType.DECISION; break;
        }

        tokens.push({
          type: tokenType,
          value,
          line: startLine,
          column: startColumn
        });
      } else {
        // Skip unknown characters
        this.advance();
      }
    }

    tokens.push({
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column
    });

    return tokens;
  }
}

// Parser implementation
export class Parser {
  private tokens: Token[];
  private position: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.position] || { type: TokenType.EOF, value: '', line: 0, column: 0 };
  }

  private advance(): Token {
    const token = this.peek();
    if (token.type !== TokenType.EOF) {
      this.position++;
    }
    return token;
  }

  private consume(expectedType: TokenType): Token {
    const token = this.advance();
    if (token.type !== expectedType) {
      throw new Error(`Expected ${expectedType} but got ${token.type} at line ${token.line}, column ${token.column}`);
    }
    return token;
  }

  private skipNewlines(): void {
    while (this.peek().type === TokenType.NEWLINE) {
      this.advance();
    }
  }

  parse(): DiagramNode {
    this.skipNewlines();
    
    const diagramTypeToken = this.peek();
    let diagramType: 'flowchart' | 'sequence' | 'class';

    if (diagramTypeToken.type === TokenType.FLOWCHART) {
      diagramType = 'flowchart';
      this.advance();
    } else if (diagramTypeToken.type === TokenType.SEQUENCE) {
      diagramType = 'sequence';
      this.advance();
    } else if (diagramTypeToken.type === TokenType.CLASS) {
      diagramType = 'class';
      this.advance();
    } else {
      throw new Error(`Expected diagram type (flowchart, sequence, class) but got ${diagramTypeToken.type} at line ${diagramTypeToken.line}`);
    }

    this.skipNewlines();

    const statements: StatementNode[] = [];
    while (this.peek().type !== TokenType.EOF) {
      const statement = this.parseStatement(diagramType);
      if (statement) {
        statements.push(statement);
      }
      this.skipNewlines();
    }

    return {
      type: 'diagram',
      diagramType,
      statements
    };
  }

  private parseStatement(diagramType: 'flowchart' | 'sequence' | 'class'): StatementNode | null {
    if (this.peek().type === TokenType.EOF || this.peek().type === TokenType.NEWLINE) {
      return null;
    }

    if (diagramType === 'sequence') {
      return this.parseSequenceStatement();
    } else if (diagramType === 'class') {
      return this.parseClassStatement();
    } else {
      return this.parseFlowchartStatement();
    }
  }

  private parseSequenceStatement(): SequenceStatement {
    const from = this.consume(TokenType.IDENTIFIER).value;
    this.consume(TokenType.ARROW);
    const to = this.consume(TokenType.IDENTIFIER).value;
    this.consume(TokenType.COLON);
    const message = this.consume(TokenType.STRING).value;

    return {
      type: 'sequence',
      from,
      to,
      message
    };
  }

  private parseClassStatement(): ClassStatement {
    const name = this.consume(TokenType.IDENTIFIER).value;
    return {
      type: 'class',
      name
    };
  }

  private parseFlowchartStatement(): StatementNode {
    const first = this.peek();

    // Check if it's a node definition (start/end/process/decision)
    if (first.type === TokenType.START || first.type === TokenType.END || 
        first.type === TokenType.PROCESS || first.type === TokenType.DECISION) {
      
      const nodeType = this.advance().value;
      const id = this.consume(TokenType.IDENTIFIER).value;
      
      let label: string | undefined;
      if (this.peek().type === TokenType.COLON) {
        this.advance(); // consume colon
        label = this.consume(TokenType.STRING).value;
      }

      return {
        type: 'nodeDefinition',
        nodeType,
        id,
        label
      } as NodeDefinitionStatement;
    } else if (first.type === TokenType.IDENTIFIER) {
      // It's either a connection or a standalone node
      const from = this.advance().value;
      
      if (this.peek().type === TokenType.ARROW) {
        this.advance(); // consume arrow
        const to = this.consume(TokenType.IDENTIFIER).value;
        
        let label: string | undefined;
        if (this.peek().type === TokenType.COLON) {
          this.advance(); // consume colon
          label = this.consume(TokenType.STRING).value;
        }

        return {
          type: 'connection',
          from,
          to,
          label
        } as ConnectionStatement;
      } else {
        // Standalone node reference (for connections without explicit arrows)
        return {
          type: 'nodeDefinition',
          nodeType: 'process',
          id: from
        } as NodeDefinitionStatement;
      }
    }

    throw new Error(`Unexpected token ${first.type} at line ${first.line}`);
  }
}

// Mermaid translator
export class MermaidTranslator {
  translate(ast: DiagramNode): string {
    switch (ast.diagramType) {
      case 'flowchart':
        return this.translateFlowchart(ast);
      case 'sequence':
        return this.translateSequence(ast);
      case 'class':
        return this.translateClass(ast);
      default:
        throw new Error(`Unsupported diagram type: ${ast.diagramType}`);
    }
  }

  private translateFlowchart(ast: DiagramNode): string {
    let result = 'flowchart TD\n';
    
    for (const statement of ast.statements) {
      if (statement.type === 'nodeDefinition') {
        const node = statement as NodeDefinitionStatement;
        result += this.translateFlowchartNode(node);
      } else if (statement.type === 'connection') {
        const conn = statement as ConnectionStatement;
        result += this.translateFlowchartConnection(conn);
      }
    }

    return result;
  }

  private translateFlowchartNode(node: NodeDefinitionStatement): string {
    const { nodeType, id, label } = node;
    const displayLabel = label || id;

    switch (nodeType) {
      case 'start':
        return `    ${id}([${displayLabel}])\n`;
      case 'end':
        return `    ${id}([${displayLabel}])\n`;
      case 'process':
        return `    ${id}[${displayLabel}]\n`;
      case 'decision':
        return `    ${id}{${displayLabel}}\n`;
      default:
        return `    ${id}[${displayLabel}]\n`;
    }
  }

  private translateFlowchartConnection(conn: ConnectionStatement): string {
    const { from, to, label } = conn;
    if (label) {
      return `    ${from} -->|${label}| ${to}\n`;
    } else {
      return `    ${from} --> ${to}\n`;
    }
  }

  private translateSequence(ast: DiagramNode): string {
    let result = 'sequenceDiagram\n';
    
    for (const statement of ast.statements) {
      if (statement.type === 'sequence') {
        const seq = statement as SequenceStatement;
        result += `    ${seq.from}->>${seq.to}: ${seq.message}\n`;
      }
    }

    return result;
  }

  private translateClass(ast: DiagramNode): string {
    let result = 'classDiagram\n';
    
    for (const statement of ast.statements) {
      if (statement.type === 'class') {
        const cls = statement as ClassStatement;
        result += `    class ${cls.name}\n`;
      }
    }

    return result;
  }
}

// Main translation function
export function translateToMermaid(input: string): string {
  try {
    // Use the new parser system
    const parser = new (require('./parser/parser').Parser)(input);
    const ast = parser.parse();
    
    const translator = new (require('./translator/mermaid-translator').MermaidTranslator)();
    return translator.translate(ast);
  } catch (error) {
    // Fallback to legacy parser for compatibility
    const lexer = new Lexer(input);
    const tokens = lexer.tokenize();
    
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    const translator = new MermaidTranslator();
    return translator.translate(ast);
  }
}
