# Examples Documentation

This directory contains comprehensive examples demonstrating all MermaidAid features and real-world use cases.

## Example Categories

### 📚 Basic Examples
Learn the fundamentals with simple, clear examples:
- [Basic Flowchart](basic/flowchart-simple.md)
- [Basic Sequence](basic/sequence-simple.md)
- [Basic Class Diagram](basic/class-simple.md)

### 🚀 Feature Demonstrations
See specific features in action:
- [Chained Connections](features/chained-connections.md)
- [Smart Node Inference](features/smart-inference.md)
- [Symbol Shortcuts](features/symbols.md)
- [Natural Language Style](features/natural-language.md)
- [Comments and Documentation](features/comments.md)

### 🌍 Real-World Examples
Production-ready diagrams for common scenarios:
- [User Authentication Flow](real-world/auth-flow.md)
- [E-commerce Checkout](real-world/ecommerce-checkout.md)
- [API Request Lifecycle](real-world/api-lifecycle.md)
- [Database Transaction](real-world/db-transaction.md)
- [CI/CD Pipeline](real-world/cicd-pipeline.md)
- [Microservices Architecture](real-world/microservices.md)

### 🏭 Industry Use Cases
Specialized examples for different domains:
- [Healthcare Workflows](industry/healthcare.md)
- [Financial Processes](industry/finance.md)
- [Manufacturing Systems](industry/manufacturing.md)
- [Educational Flows](industry/education.md)

### 🎯 Best Practices
Examples showcasing optimal usage patterns:
- [Readable Diagrams](best-practices/readable.md)
- [Maintainable Code](best-practices/maintainable.md)
- [Performance Patterns](best-practices/performance.md)
- [Error Handling](best-practices/error-handling.md)

## Quick Reference Examples

### Ultra-Compact Flowchart
```mad
flow
@ start -> validate -> ? ok -> ! done
ok -> error: failed -> start: retry
```

### Natural Language Style
```mad
flow
when user logs in
if credentials are valid
then show dashboard
else show error and retry
```

### Chained with Symbols
```mad
flow
@ login: User Login -> auth: Authenticate -> ? valid: Check -> ! home: Dashboard
valid -> error: Invalid -> login: Try Again
```

### Complex Business Process
```mad
flow
// Order processing workflow
@ order: New Order
order -> validate -> ? payment
payment -> inventory: paid -> ? stock
stock -> ship: available -> ! delivered
stock -> backorder: unavailable -> notify -> ship
payment -> decline: failed -> notify_customer -> ! cancelled
```

## Running Examples

### Command Line
```bash
# Run any example
node dist/cli.js examples/basic/flowchart-simple.mad

# Save output
node dist/cli.js examples/real-world/auth-flow.mad -o auth.mmd

# View in browser (if you have a local server)
node dist/cli.js examples/real-world/auth-flow.mad | mermaid-viewer
```

### Batch Processing
```bash
# Process all examples
for file in examples/**/*.mad; do
  node dist/cli.js "$file" -o "${file%.mad}.mmd"
done
```

## Contributing Examples

When adding new examples:

1. **Clear Purpose**: Each example should demonstrate specific features or solve real problems
2. **Comments**: Add explanatory comments for complex logic
3. **Progressive Complexity**: Start simple, build up to advanced features
4. **Real-World Relevance**: Base examples on actual use cases
5. **Multiple Approaches**: Show different ways to achieve the same result

### Example Template
```mad
// Example: [Brief Description]
// Demonstrates: [Key Features]
// Use Case: [When to use this pattern]

flow
// Main logic with comments
@ start: Clear Starting Point
start -> process: Descriptive action
process -> ? decision: Clear question?
decision -> success: positive outcome
decision -> error: negative outcome
! success: Clear end state
error -> start: recovery action
```

## Integration Examples

### With GitHub Markdown
```markdown
# Project Documentation

## Process Flow

\```mermaid
[Generated Mermaid code from MermaidAid]
\```
```

### With Documentation Tools
- GitBook integration
- Confluence diagrams
- Notion embedded diagrams
- VS Code preview

### With CI/CD
```yaml
# Example GitHub Action
- name: Generate Diagrams
  run: |
    for file in docs/**/*.mad; do
      node dist/cli.js "$file" -o "${file%.mad}.mmd"
    done
```

## Next Steps

1. Start with [Basic Examples](basic/)
2. Try [Feature Demonstrations](features/)
3. Explore [Real-World Examples](real-world/)
4. Apply [Best Practices](best-practices/)
5. Create your own examples!
