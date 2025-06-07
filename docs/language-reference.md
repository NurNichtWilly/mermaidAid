# Language Reference

Complete reference for MermaidAid syntax and features.

## Diagram Types

### Flowcharts

**Declaration:**
```
flow
flowchart
```

**Basic Structure:**
```
flow
nodeA -> nodeB
nodeB -> nodeC: label
```

### Sequence Diagrams

**Declaration:**
```
seq
sequence
```

**Basic Structure:**
```
seq
participantA -> participantB: message
participantB -> participantA: response
```

### Class Diagrams

**Declaration:**
```
class
```

**Basic Structure:**
```
class
ClassA
ClassB
ClassA -> ClassB
```

## Node Types and Symbols

### Standard Node Types

| Type | Symbol | Alternative | Description | Mermaid Output |
|------|--------|-------------|-------------|----------------|
| Start | `@` | `○` | Entry point | `([text])` |
| End | `!` | `●` | Exit point | `([text])` |
| Decision | `?` | `<>` | Conditional | `{text}` |
| Process | (none) | `□` | Default action | `[text]` |

### Symbol Usage Examples

```
flow
@ start: Application Launch      // Start node
process: Load Configuration      // Process node (default)
? check: Config Valid?           // Decision node
! success: App Ready            // End node
□ backup: Use Defaults          // Explicit process node
```

## Smart Node Inference

MermaidAid automatically detects node types from naming patterns:

### Start Node Keywords
- `start`, `begin`, `init`, `launch`, `open`, `enter`
- `startup`, `initialize`, `boot`, `load`

```
flow
startup -> configure -> ready  // 'startup' becomes start node
```

### End Node Keywords
- `end`, `finish`, `success`, `done`, `complete`, `exit`
- `terminate`, `close`, `final`, `stop`

```
flow
process -> validate -> complete  // 'complete' becomes end node
```

### Decision Node Keywords
- `check`, `valid`, `decide`, `choice`, `test`, `verify`
- `confirm`, `approve`, `evaluate`, `assess`

```
flow
input -> validate -> success    // 'validate' becomes decision node
```

## Connection Types

### Basic Connections
```
A -> B              // Simple arrow
A -> B: label       // Arrow with label
A <-> B             // Bidirectional
A <-> B: label      // Bidirectional with label
```

### Chained Connections
```
A -> B -> C -> D                    // Linear chain
A -> B -> C: step1 -> D: step2     // Chain with labels
@ start -> process -> ? check -> ! end  // Mixed types
```

### Complex Chains
```
flow
@ login -> auth -> ? valid
valid -> profile: success -> ! welcome
valid -> error: failed -> login: retry
```

## Labels and Text

### Simple Labels
```
node: Simple Label
node: Multi word label
```

### Labels with Special Characters
```
node: "Label with: special chars"
node: 'Label with quotes'
```

### Node Definition Patterns
```
// Pattern 1: Symbol + name + label
@ start: Welcome Screen

// Pattern 2: Name + label
login: User Login

// Pattern 3: Just name (label inferred)
authenticate

// Pattern 4: Symbol + name (label = name)
? decision
```

## Comments

### Line Comments
```
flow
// This is a comment
start -> process  // End of line comment
// Multi-line
// comments
// are supported
```

### Comment Placement
```
flow
// Header comment
@ start: Begin Process

start -> validate    // Validation step
// Check if user is valid
? validate: User Valid?

validate -> success: yes  // Success path
validate -> error: no     // Error path

// Cleanup and exit
! success: Welcome
```

## Advanced Syntax

### Natural Language Style
```
flow
when user opens app
if credentials are valid
then show dashboard
else show error message
```

### Conditional Expressions
```
flow
@ user_login: User starts login
user_login -> enter_credentials
enter_credentials -> ? credentials_valid: Are credentials valid?
credentials_valid -> dashboard: yes, valid credentials
credentials_valid -> error_message: no, invalid credentials
! dashboard: User sees dashboard
error_message -> user_login: retry login
```

## Reserved Keywords

### Diagram Types
- `flow`, `flowchart`
- `seq`, `sequence`
- `class`

### Natural Language
- `when`, `if`, `then`, `else`

### Special Symbols
- `->` (arrow)
- `<->` (bidirectional)
- `:` (label separator)
- `//` (comment)

## Escape Sequences

### Special Characters in Labels
```
node: "Use quotes for: colons"
node: 'Or single quotes'
node: Use\_underscores\_for\_spaces
```

### Symbol Literals
```
// To use symbols as text, quote them
node: "This has @ symbol in text"
node: 'Question marks ? work too'
```

## Error Handling

### Common Syntax Errors
1. **Missing arrows:** `A B` → `A -> B`
2. **Invalid symbols:** `# start` → `@ start`
3. **Unclosed quotes:** `node: "label` → `node: "label"`
4. **Invalid chains:** `A -> -> B` → `A -> B`

### Validation Rules
- Each diagram must start with a type declaration
- Arrows must connect valid nodes
- Labels cannot contain unescaped special characters
- Chain connections must be properly formed

## Best Practices

### Naming Conventions
```
// Good: Descriptive names
user_login -> validate_credentials -> show_dashboard

// Better: Let smart inference work
login -> validate -> dashboard
```

### Organization
```
// Group related logic
flow
// Authentication flow
@ login -> authenticate -> ? valid

// Success path
valid -> profile: success -> ! dashboard

// Error handling
valid -> error: failed
error -> login: retry
```

### Comments for Clarity
```
flow
// Main user journey
@ start: App Launch

// Core business logic
start -> authenticate
authenticate -> ? check_permissions: Has access?

// Branch outcomes
check_permissions -> dashboard: authorized
check_permissions -> limited_view: restricted

// Final states
! dashboard: Full Access
! limited_view: Limited Access
```
