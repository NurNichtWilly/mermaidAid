import { Token, TokenType, DiagramNode, FlowchartNode, ASTNode, Connection } from '../types';
import { Lexer } from './lexer';

export class Parser {
  private tokens: Token[];
  private position = 0;

  constructor(input: string) {
    const lexer = new Lexer(input);
    this.tokens = lexer.tokenize();
  }

  /**
   * Parses the tokens into an Abstract Syntax Tree
   */
  parse(): DiagramNode {
    // Skip any leading newlines or whitespace
    this.skipNewlines();
    
    const diagramType = this.parseDiagramType();
    const elements = this.parseElements(diagramType);
    
    return {
      type: 'diagram',
      diagramType,
      elements
    };
  }

  private parseDiagramType(): 'flowchart' | 'sequence' | 'class' {
    // Skip any newlines before diagram type
    this.skipNewlines();
    
    const token = this.consume();
    
    switch (token.type) {
      case TokenType.FLOWCHART:
      case TokenType.FLOW:
        return 'flowchart';
      case TokenType.SEQUENCE:
      case TokenType.SEQ:
        return 'sequence';
      case TokenType.CLASS:
        return 'class';
      default:
        throw new Error(`Expected diagram type, got ${token.type} at line ${token.line}`);
    }
  }

  private parseElements(diagramType: string): any[] {
    const elements: any[] = [];
    
    while (!this.isAtEnd() && this.currentToken().type !== TokenType.EOF) {
      // Skip newlines
      if (this.currentToken().type === TokenType.NEWLINE) {
        this.advance();
        continue;
      }
      
      switch (diagramType) {
        case 'flowchart':
          elements.push(this.parseFlowchartElement());
          break;
        case 'sequence':
          elements.push(this.parseSequenceElement());
          break;
        case 'class':
          elements.push(this.parseClassElement());
          break;
      }
    }
    
    return elements;
  }

  private parseFlowchartElement(): FlowchartNode {
    // Check if it's a symbol-based node definition
    if (this.isNodeSymbol()) {
      return this.parseSymbolNode();
    }
    
    // Check if it's an inline connection (id -> id format)
    if (this.isInlineConnection()) {
      return this.parseInlineConnection();
    }
    
    // Traditional node type parsing
    const nodeType = this.parseNodeType();
    const id = this.consumeIdentifier();
    
    let label: string | undefined;
    if (this.currentToken().type === TokenType.COLON) {
      this.advance(); // consume ':'
      label = this.consumeString();
    }
    
    const connections: Connection[] = [];
    
    // Parse connections
    while (this.currentToken().type === TokenType.ARROW || 
           this.currentToken().type === TokenType.BIDIRECTIONAL) {
      const connectionType = this.currentToken().type === TokenType.ARROW ? 'arrow' : 'bidirectional';
      this.advance();
      
      const target = this.consumeIdentifier();
      let connectionLabel: string | undefined;
      
      if (this.currentToken().type === TokenType.COLON) {
        this.advance();
        connectionLabel = this.consumeString();
      }
      
      connections.push({
        target,
        label: connectionLabel,
        type: connectionType
      });
    }
    
    return {
      type: 'flowchart-node',
      nodeType,
      id,
      label,
      connections: connections.length > 0 ? connections : undefined
    };
  }

  private isNodeSymbol(): boolean {
    const token = this.currentToken();
    return token.type === TokenType.START_SYMBOL || 
           token.type === TokenType.END_SYMBOL ||
           token.type === TokenType.DECISION_SYMBOL ||
           token.type === TokenType.PROCESS_SYMBOL;
  }

  private isInlineConnection(): boolean {
    // Look ahead to see if pattern is: identifier -> identifier
    const saved = this.position;
    try {
      if (this.currentToken().type === TokenType.IDENTIFIER) {
        this.advance();
        if (this.currentToken().type === TokenType.ARROW || 
            this.currentToken().type === TokenType.BIDIRECTIONAL) {
          this.position = saved;
          return true;
        }
      }
    } catch {
      // ignore
    }
    this.position = saved;
    return false;
  }

  private parseSymbolNode(): FlowchartNode {
    const symbolToken = this.consume();
    const id = this.consumeIdentifier();
    
    let nodeType: 'process' | 'decision' | 'start' | 'end';
    switch (symbolToken.type) {
      case TokenType.START_SYMBOL:
        nodeType = 'start';
        break;
      case TokenType.END_SYMBOL:
        nodeType = 'end';
        break;
      case TokenType.DECISION_SYMBOL:
        nodeType = 'decision';
        break;
      case TokenType.PROCESS_SYMBOL:
      default:
        nodeType = 'process';
        break;
    }
    
    let label: string | undefined;
    if (this.currentToken().type === TokenType.COLON) {
      this.advance(); // consume ':'
      if (this.currentToken().type === TokenType.STRING || 
          this.currentToken().type === TokenType.IDENTIFIER) {
        label = this.consumeString();
      }
    }
    
    return {
      type: 'flowchart-node',
      nodeType,
      id,
      label
    };
  }

  private parseInlineConnection(): FlowchartNode {
    const connections: Connection[] = [];
    const firstNodeId = this.consumeIdentifier();
    let from = firstNodeId;
    
    // Parse chained connections: A -> B -> C -> D
    while (this.currentToken().type === TokenType.ARROW || 
           this.currentToken().type === TokenType.BIDIRECTIONAL) {
      
      const connectionType = this.currentToken().type === TokenType.ARROW ? 'arrow' : 'bidirectional';
      this.advance(); // consume arrow
      
      // Check if target is a symbol node
      let to: string;
      let targetNodeType: 'process' | 'decision' | 'start' | 'end' = 'process';
      
      if (this.isNodeSymbol()) {
        const symbolToken = this.consume();
        to = this.consumeIdentifier();
        
        switch (symbolToken.type) {
          case TokenType.START_SYMBOL:
            targetNodeType = 'start';
            break;
          case TokenType.END_SYMBOL:
            targetNodeType = 'end';
            break;
          case TokenType.DECISION_SYMBOL:
            targetNodeType = 'decision';
            break;
          default:
            targetNodeType = 'process';
            break;
        }
      } else {
        to = this.consumeIdentifier();
      }
      
      let label: string | undefined;
      if (this.currentToken().type === TokenType.COLON) {
        this.advance();
        label = this.consumeString();
      }
      
      connections.push({
        target: to,
        label,
        type: connectionType
      });
      
      // For chaining, the target becomes the new source
      from = to;
    }
    
    // Return the first node with all connections
    return {
      type: 'flowchart-node',
      nodeType: 'process',
      id: firstNodeId,
      inline: true,
      connections: connections.length > 0 ? connections : undefined
    };
  }

  private parseSequenceElement(): any {
    const actor = this.consumeIdentifier();
    this.expectToken(TokenType.ARROW);
    const target = this.consumeIdentifier();
    this.expectToken(TokenType.COLON);
    const message = this.consumeString();
    
    return {
      type: 'sequence-node',
      id: `${actor}_${target}_${message}`,
      actor,
      target,
      message
    };
  }

  private parseClassElement(): any {
    const className = this.consumeIdentifier();
    
    // Simple class definition for now
    return {
      type: 'class-node',
      id: className,
      className,
      attributes: [],
      methods: [],
      relationships: []
    };
  }

  private parseNodeType(): 'process' | 'decision' | 'start' | 'end' {
    const token = this.currentToken();
    
    // Legacy support for explicit node types - but be more careful
    switch (token.value?.toLowerCase()) {
      case 'start':
        if (token.type === TokenType.IDENTIFIER) {
          this.advance();
          return 'start';
        }
        break;
      case 'end':
        if (token.type === TokenType.IDENTIFIER) {
          this.advance();
          return 'end';
        }
        break;
      case 'process':
        if (token.type === TokenType.IDENTIFIER) {
          this.advance();
          return 'process';
        }
        break;
      case 'decision':
        if (token.type === TokenType.IDENTIFIER) {
          this.advance();
          return 'decision';
        }
        break;
    }
    
    // Default to process if no specific type is given
    return 'process';
  }

  private consumeIdentifier(): string {
    const token = this.consume();
    if (token.type !== TokenType.IDENTIFIER) {
      throw new Error(`Expected identifier, got ${token.type} at line ${token.line}`);
    }
    return token.value;
  }

  private consumeString(): string {
    const token = this.consume();
    if (token.type === TokenType.STRING) {
      return token.value;
    }
    if (token.type === TokenType.IDENTIFIER) {
      // Check if there are more identifiers to form a multi-word label
      let result = token.value;
      while (this.currentToken().type === TokenType.IDENTIFIER) {
        result += ' ' + this.consume().value;
      }
      return result;
    }
    throw new Error(`Expected string or identifier, got ${token.type} at line ${token.line}`);
  }

  private expectToken(expectedType: TokenType): void {
    const token = this.consume();
    if (token.type !== expectedType) {
      throw new Error(`Expected ${expectedType}, got ${token.type} at line ${token.line}`);
    }
  }

  private currentToken(): Token {
    return this.tokens[this.position] || this.tokens[this.tokens.length - 1];
  }

  private skipNewlines(): void {
    while (this.currentToken().type === TokenType.NEWLINE) {
      this.advance();
    }
  }

  private consume(): Token {
    if (this.isAtEnd()) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[this.position++];
  }

  private advance(): void {
    if (!this.isAtEnd()) {
      this.position++;
    }
  }

  private isAtEnd(): boolean {
    return this.position >= this.tokens.length || 
           this.currentToken().type === TokenType.EOF;
  }
}
