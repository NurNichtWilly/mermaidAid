# MermaidAid Documentation

Welcome to the comprehensive documentation for MermaidAid - the simplified language for creating Mermaid diagrams.

## Table of Contents

1. [Quick Start Guide](quick-start.md)
2. [Language Reference](language-reference.md)
3. [Examples](examples/README.md)
4. [Advanced Features](advanced-features.md)
5. [API Reference](api-reference.md)
6. [Best Practices](best-practices.md)
7. [Migration Guide](migration-guide.md)
8. [Troubleshooting](troubleshooting.md)

## What is MermaidAid?

MermaidAid is a simplified syntax language that translates to standard Mermaid diagrams. It's designed to make diagram creation faster, more intuitive, and accessible to both technical and non-technical users.

### Key Benefits

- **90% less syntax** - Ultra-compact notation
- **Smart inference** - Automatically detects node types
- **Natural language** - Reads like plain English
- **Chain connections** - Connect multiple nodes in one line
- **Comment support** - Document your diagrams
- **Symbol shortcuts** - Intuitive visual symbols

### Supported Diagram Types

- 📊 **Flowcharts** - Process flows, decision trees, workflows
- 🔄 **Sequence Diagrams** - System interactions, API flows
- 📋 **Class Diagrams** - Object relationships, system architecture

## Quick Example

**MermaidAid:**
```
flow
@ start: User Login
start -> validate -> ? decision -> ! success
decision -> error: failed
error -> start: retry
```

**Generated Mermaid:**
```mermaid
flowchart TD
    start([User Login])
    validate[validate]
    decision{decision}
    success([success])
    error[error]
    start --> validate
    validate --> decision
    decision --> success
    decision --> error : failed
    error --> start : retry
```

## Getting Started

1. [Install MermaidAid](quick-start.md#installation)
2. [Learn the basic syntax](language-reference.md)
3. [Try the examples](examples/README.md)
4. [Explore advanced features](advanced-features.md)
