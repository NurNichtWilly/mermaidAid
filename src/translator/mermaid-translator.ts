import { DiagramNode, FlowchartNode, SequenceNode, ClassNode } from '../types';
import { Parser } from '../parser/parser';

export class MermaidTranslator {
  /**
   * Translates an AST to Mermaid diagram syntax
   */
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
    const lines: string[] = ['flowchart TD'];
    const processedNodes = new Set<string>();
    const connections: string[] = [];
    const nodeDefinitions = new Map<string, FlowchartNode>();
    
    // First pass: collect all nodes and their definitions
    for (const element of ast.elements) {
      if (element.type === 'flowchart-node') {
        const node = element as FlowchartNode;
        
        // Store node definition for reference, preserving original node type
        if (!nodeDefinitions.has(node.id)) {
          nodeDefinitions.set(node.id, node);
        }
        
        // Handle chained connections
        if (node.connections) {
          let fromNode = node.id;
          
          for (const connection of node.connections) {
            const connectionLine = this.generateConnection(fromNode, connection);
            connections.push(`    ${connectionLine}`);
            
            // Auto-generate target node if not already defined
            if (!nodeDefinitions.has(connection.target)) {
              // Try to infer node type from context or use process as default
              const inferredNodeType = this.inferNodeType(connection.target, connection.label);
              nodeDefinitions.set(connection.target, {
                type: 'flowchart-node',
                nodeType: inferredNodeType,
                id: connection.target,
                label: connection.target
              } as FlowchartNode);
            }
            
            // For chained connections, update the from node
            fromNode = connection.target;
          }
        }
      }
    }
    
    // Second pass: generate all node definitions
    for (const [nodeId, node] of nodeDefinitions) {
      if (!processedNodes.has(nodeId)) {
        const nodeDefinition = this.generateFlowchartNode(node);
        lines.push(`    ${nodeDefinition}`);
        processedNodes.add(nodeId);
      }
    }
    
    // Add all connections
    lines.push(...connections);
    
    return lines.join('\n');
  }

  /**
   * Infers node type based on name patterns and context
   */
  private inferNodeType(nodeId: string, label?: string): 'process' | 'decision' | 'start' | 'end' {
    const text = (label || nodeId).toLowerCase();
    
    // Decision patterns
    if (text.includes('?') || text.includes('decide') || text.includes('check') || 
        text.includes('valid') || text.includes('choose') || text.includes('if')) {
      return 'decision';
    }
    
    // Start patterns
    if (text.includes('start') || text.includes('begin') || text.includes('init') ||
        text.includes('launch') || text.includes('open')) {
      return 'start';
    }
    
    // End patterns
    if (text.includes('end') || text.includes('finish') || text.includes('complete') ||
        text.includes('done') || text.includes('success') || text.includes('fail')) {
      return 'end';
    }
    
    // Default to process
    return 'process';
  }

  private generateFlowchartNode(node: FlowchartNode): string {
    const label = node.label || node.id;
    
    switch (node.nodeType) {
      case 'start':
        return `${node.id}([${label}])`;
      case 'end':
        return `${node.id}([${label}])`;
      case 'decision':
        return `${node.id}{${label}}`;
      case 'process':
      default:
        return `${node.id}[${label}]`;
    }
  }

  private generateConnection(from: string, connection: any): string {
    const arrow = connection.type === 'bidirectional' ? '---' : '-->';
    const label = connection.label ? `|${connection.label}|` : '';
    
    return `${from} ${arrow}${label} ${connection.target}`;
  }

  private translateSequence(ast: DiagramNode): string {
    const lines: string[] = ['sequenceDiagram'];
    
    for (const element of ast.elements) {
      if (element.type === 'sequence-node') {
        const node = element as SequenceNode;
        lines.push(`    ${node.actor}->>${node.target}: ${node.message}`);
      }
    }
    
    return lines.join('\n');
  }

  private translateClass(ast: DiagramNode): string {
    const lines: string[] = ['classDiagram'];
    
    for (const element of ast.elements) {
      if (element.type === 'class-node') {
        const node = element as ClassNode;
        lines.push(`    class ${node.className}`);
        
        // Add attributes and methods if any
        if (node.attributes && node.attributes.length > 0) {
          for (const attr of node.attributes) {
            lines.push(`    ${node.className} : ${attr}`);
          }
        }
        
        if (node.methods && node.methods.length > 0) {
          for (const method of node.methods) {
            lines.push(`    ${node.className} : ${method}()`);
          }
        }
      }
    }
    
    return lines.join('\n');
  }
}

/**
 * Convenience function to translate simplified syntax to Mermaid
 */
export function translateToMermaid(simplifiedCode: string): string {
  const parser = new Parser(simplifiedCode);
  const ast = parser.parse();
  const translator = new MermaidTranslator();
  return translator.translate(ast);
}
