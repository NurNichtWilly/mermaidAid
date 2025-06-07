# Quick Start Guide

Get up and running with MermaidAid in under 5 minutes!

## Installation

### Prerequisites
- Node.js 16+ installed on your system

### Setup
```bash
# Clone or download the project
cd mermaidAid

# Install dependencies
npm install

# Build the project
npm run build
```

### Verify Installation
```bash
node dist/cli.js --help
```

## Your First Diagram

### 1. Create a Simple Flowchart

Create a file called `my-first-diagram.mad`:

```
flow
@ start: Welcome
start -> login
login -> ? auth: Valid?
auth -> home: yes
auth -> error: no
! home: Dashboard
error -> login: retry
```

### 2. Convert to Mermaid

```bash
node dist/cli.js my-first-diagram.mad -o output.mmd
```

### 3. View the Result

Open `output.mmd` to see the generated Mermaid code, or use the [Mermaid Live Editor](https://mermaid.live/) to visualize it.

## Basic Syntax Patterns

### Simple Flow
```
flow
A -> B -> C
```

### With Labels
```
flow
login -> validate: check
validate -> success: valid
```

### Decision Points
```
flow
process -> ? decision
decision -> yes: approved
decision -> no: rejected
```

### Node Types
```
flow
@ start: Begin       // Start node (rounded)
process: Do work     // Process node (rectangle)
? decide: Choice?    // Decision node (diamond)
! end: Complete      // End node (rounded)
```

## Common Patterns

### Linear Process
```
flow
@ begin -> step1 -> step2 -> step3 -> ! end
```

### Branching Logic
```
flow
@ start -> ? check
check -> success: valid
check -> error: invalid
error -> start: retry
! success: Done
```

### Loop with Condition
```
flow
@ start -> process -> ? done
done -> ! end: yes
done -> process: no
```

## Next Steps

- [Learn the complete syntax](language-reference.md)
- [Explore examples](examples/README.md)
- [Discover advanced features](advanced-features.md)

## Need Help?

- Check the [Troubleshooting Guide](troubleshooting.md)
- Browse [Best Practices](best-practices.md)
- See [Real-world Examples](examples/real-world/)
