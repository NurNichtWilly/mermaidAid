# Basic Flowchart Example

This example demonstrates the fundamental MermaidAid syntax for creating flowcharts.

## MermaidAid Source

```mad
flow
# Simple decision flowchart
@ start: Start Process
start -> validate: check input
validate -> ? decision: Valid input?
decision -> process: yes -> complete: Process data
decision -> error: no -> retry: Show error
retry -> start: user retry
complete -> ! end: End
```

## Generated Mermaid

```mermaid
flowchart TD
    start([Start Process])
    validate[validate]
    decision{Valid input?}
    process[process]
    complete[complete]
    error[error]
    retry[retry]
    end([End])
    
    start --> validate
    validate --> decision
    decision -->|yes| process
    process --> complete
    decision -->|no| error
    error --> retry
    retry --> start
    complete --> end
```

## Key Features Demonstrated

### Node Types
- `@` - Start node (rounded rectangle)
- `!` - End node (rounded rectangle)  
- `?` - Decision node (diamond)
- Default - Process node (rectangle)

### Connections
- `->` - Flow connection
- `label` - Connection labels for decision branches

### Comments
- `#` - Comment lines for documentation

## Usage Tips

1. Always start with `flow` to indicate flowchart type
2. Use descriptive node names that explain the action
3. Keep decision questions clear and answerable
4. Group related processes logically

This example covers the most common flowchart patterns you'll need!
