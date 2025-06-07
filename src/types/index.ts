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
  FLOW = 'FLOW',
  SEQ = 'SEQ',
  
  // Node/element types
  NODE = 'NODE',
  DECISION = 'DECISION',
  PROCESS = 'PROCESS',
  START = 'START',
  END = 'END',
  
  // Node type symbols
  START_SYMBOL = 'START_SYMBOL',      // ○ or @
  END_SYMBOL = 'END_SYMBOL',          // ● or !
  DECISION_SYMBOL = 'DECISION_SYMBOL', // ? or <>
  PROCESS_SYMBOL = 'PROCESS_SYMBOL',   // □ or []
  
  // Connections
  ARROW = 'ARROW',                    // ->
  BIDIRECTIONAL = 'BIDIRECTIONAL',    // <->
  PIPE = 'PIPE',                      // |
  
  // Natural language keywords
  WHEN = 'WHEN',                      // when (triggers flow)
  IF = 'IF',                          // if (decision context)
  THEN = 'THEN',                      // then (connection)
  ELSE = 'ELSE',                      // else (alternative connection)
  
  // Identifiers and literals
  IDENTIFIER = 'IDENTIFIER',
  STRING = 'STRING',
  WORD = 'WORD',                      // Unquoted text
  
  // Punctuation
  COLON = 'COLON',
  SEMICOLON = 'SEMICOLON',
  NEWLINE = 'NEWLINE',
  PARENTHESES_OPEN = 'PARENTHESES_OPEN',
  PARENTHESES_CLOSE = 'PARENTHESES_CLOSE',
  BRACKET_OPEN = 'BRACKET_OPEN',
  BRACKET_CLOSE = 'BRACKET_CLOSE',
  
  // Special
  EOF = 'EOF',
  WHITESPACE = 'WHITESPACE'
}

export interface ASTNode {
  type: string;
  [key: string]: any;
}

export interface DiagramNode extends ASTNode {
  type: 'diagram';
  diagramType: 'flowchart' | 'sequence' | 'class';
  elements: ElementNode[];
}

export interface ElementNode extends ASTNode {
  id: string;
  label?: string;
}

export interface FlowchartNode extends ElementNode {
  type: 'flowchart-node';
  nodeType: 'process' | 'decision' | 'start' | 'end';
  connections?: Connection[];
  inline?: boolean;  // For inline node definitions
}

export interface Connection {
  target: string;
  label?: string;
  type: 'arrow' | 'bidirectional';
}

export interface SequenceNode extends ElementNode {
  type: 'sequence-node';
  actor: string;
  target: string;
  message: string;
}

export interface ClassNode extends ElementNode {
  type: 'class-node';
  className: string;
  attributes?: string[];
  methods?: string[];
  relationships?: ClassRelationship[];
}

export interface ClassRelationship {
  target: string;
  type: 'inheritance' | 'composition' | 'aggregation' | 'association';
}
