import { Token, TokenType } from '../types';

export class Lexer {
  private input: string;
  private position = 0;
  private line = 1;
  private column = 1;

  constructor(input: string) {
    this.input = input;
  }

  /**
   * Tokenizes the input string into an array of tokens
   */
  tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (this.position < this.input.length) {
      const token = this.nextToken();
      if (token.type !== TokenType.WHITESPACE) {
        tokens.push(token);
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

  private nextToken(): Token {
    this.skipWhitespace();
    
    if (this.position >= this.input.length) {
      return this.createToken(TokenType.EOF, '');
    }

    const char = this.currentChar();
    
    // Handle comments
    if (char === '/' && this.peek() === '/') {
      this.skipComment();
      return this.nextToken();
    }
    
    // Handle newlines
    if (char === '\n') {
      const token = this.createToken(TokenType.NEWLINE, char);
      this.advance();
      this.line++;
      this.column = 1;
      return token;
    }
    
    // Handle strings (quoted text)
    if (char === '"' || char === "'") {
      return this.readString(char);
    }
    
    // Handle arrows and connections
    if (char === '-') {
      if (this.peek() === '>') {
        const token = this.createToken(TokenType.ARROW, '->');
        this.advance();
        this.advance();
        return token;
      }
      if (this.peek() === '-') {
        const token = this.createToken(TokenType.BIDIRECTIONAL, '--');
        this.advance();
        this.advance();
        return token;
      }
    }
    
    // Handle bidirectional arrows
    if (char === '<') {
      if (this.peek() === '-' && this.input[this.position + 2] === '>') {
        const token = this.createToken(TokenType.BIDIRECTIONAL, '<->');
        this.advance();
        this.advance();
        this.advance();
        return token;
      }
      if (this.peek() === '>') {
        const token = this.createToken(TokenType.DECISION_SYMBOL, '<>');
        this.advance();
        this.advance();
        return token;
      }
    }
    
    // Handle node type symbols
    if (char === '○' || char === '@') {
      const token = this.createToken(TokenType.START_SYMBOL, char);
      this.advance();
      return token;
    }
    
    if (char === '●' || char === '!') {
      const token = this.createToken(TokenType.END_SYMBOL, char);
      this.advance();
      return token;
    }
    
    // Be more careful with ? - only treat as decision symbol at start of line or after whitespace
    if (char === '?' && (this.position === 0 || /\s/.test(this.input[this.position - 1]))) {
      const token = this.createToken(TokenType.DECISION_SYMBOL, char);
      this.advance();
      return token;
    }
    
    if (char === '□') {
      const token = this.createToken(TokenType.PROCESS_SYMBOL, char);
      this.advance();
      return token;
    }
    
    if (char === '|') {
      const token = this.createToken(TokenType.PIPE, char);
      this.advance();
      return token;
    }
    
    // Handle brackets
    if (char === '[') {
      const token = this.createToken(TokenType.BRACKET_OPEN, char);
      this.advance();
      return token;
    }
    
    if (char === ']') {
      const token = this.createToken(TokenType.BRACKET_CLOSE, char);
      this.advance();
      return token;
    }
    
    // Handle parentheses
    if (char === '(') {
      const token = this.createToken(TokenType.PARENTHESES_OPEN, char);
      this.advance();
      return token;
    }
    
    if (char === ')') {
      const token = this.createToken(TokenType.PARENTHESES_CLOSE, char);
      this.advance();
      return token;
    }
    
    // Handle punctuation
    if (char === ':') {
      const token = this.createToken(TokenType.COLON, char);
      this.advance();
      return token;
    }
    
    if (char === ';') {
      const token = this.createToken(TokenType.SEMICOLON, char);
      this.advance();
      return token;
    }
    
    // Handle identifiers and keywords
    if (this.isAlpha(char)) {
      return this.readIdentifier();
    }
    
    // Skip unknown characters
    this.advance();
    return this.nextToken();
  }

  private readString(quote: string): Token {
    const start = this.position;
    this.advance(); // Skip opening quote
    
    while (this.position < this.input.length && this.currentChar() !== quote) {
      this.advance();
    }
    
    if (this.position >= this.input.length) {
      throw new Error(`Unterminated string at line ${this.line}, column ${this.column}`);
    }
    
    const value = this.input.slice(start + 1, this.position);
    this.advance(); // Skip closing quote
    
    return this.createToken(TokenType.STRING, value);
  }

  private readIdentifier(): Token {
    const start = this.position;
    
    while (this.position < this.input.length && this.isAlphaNumeric(this.currentChar())) {
      this.advance();
    }
    
    const value = this.input.slice(start, this.position);
    const type = this.getKeywordType(value) || TokenType.IDENTIFIER;
    
    return this.createToken(type, value);
  }

  private getKeywordType(value: string): TokenType | null {
    const keywords: Record<string, TokenType> = {
      // Diagram types (support both full and short forms)
      'flowchart': TokenType.FLOWCHART,
      'flow': TokenType.FLOW,
      'sequence': TokenType.SEQUENCE,
      'seq': TokenType.SEQ,
      'class': TokenType.CLASS,
      
      // Natural language shortcuts 
      'when': TokenType.WHEN,        // "when user clicks" -> start context
      'if': TokenType.IF,            // "if valid data" -> decision context  
      'then': TokenType.THEN,        // "then process" -> connection
      'else': TokenType.ELSE,        // "else reject" -> connection
    };
    
    return keywords[value.toLowerCase()] || null;
  }

  private skipWhitespace(): void {
    while (this.position < this.input.length && 
           this.isWhitespace(this.currentChar()) && 
           this.currentChar() !== '\n') {
      this.advance();
    }
  }

  private skipComment(): void {
    // Skip // style comments until end of line
    while (this.position < this.input.length && this.currentChar() !== '\n') {
      this.advance();
    }
  }

  private currentChar(): string {
    return this.input[this.position];
  }

  private peek(): string {
    return this.input[this.position + 1] || '';
  }

  private advance(): void {
    this.position++;
    this.column++;
  }

  private createToken(type: TokenType, value: string): Token {
    return {
      type,
      value,
      line: this.line,
      column: this.column - value.length
    };
  }

  private isAlpha(char: string): boolean {
    return /[a-zA-Z_]/.test(char);
  }

  private isAlphaNumeric(char: string): boolean {
    return /[a-zA-Z0-9_]/.test(char);
  }

  private isWhitespace(char: string): boolean {
    return /\s/.test(char);
  }
}
