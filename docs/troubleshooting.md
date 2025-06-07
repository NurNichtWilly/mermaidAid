# Troubleshooting Guide

Common issues, solutions, and debugging techniques for MermaidAid.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Syntax Errors](#syntax-errors)
3. [Output Problems](#output-problems)
4. [Performance Issues](#performance-issues)
5. [Feature Not Working](#feature-not-working)
6. [Integration Problems](#integration-problems)

## Installation Issues

### Node.js Version Incompatibility

**Problem:** `Error: Cannot find module` or `SyntaxError: Unexpected token`

**Solution:**
```bash
# Check Node.js version
node --version

# Update to Node.js 16+ if needed
npm install -g n
n latest

# Rebuild the project
npm install
npm run build
```

### Build Errors

**Problem:** `npm run build` fails with TypeScript errors

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check TypeScript version
npx tsc --version

# Rebuild
npm run build
```

### Permission Issues

**Problem:** `EACCES` permission denied errors

**Solution:**
```bash
# Fix npm permissions (Linux/Mac)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use npx instead of global install
npx mermaidaid input.mad
```

## Syntax Errors

### Invalid Arrow Syntax

**Problem:** 
```mad
flow
A -- B  // Invalid arrow
A => B  // Invalid arrow  
A >> B  // Invalid arrow
```

**Solution:**
```mad
flow
A -> B     // Correct: simple arrow
A <-> B    // Correct: bidirectional
A -> B: label  // Correct: arrow with label
```

### Missing Diagram Type

**Problem:**
```mad
// Missing diagram type declaration
start -> end
```

**Solution:**
```mad
flow  // Always start with diagram type
start -> end
```

### Invalid Node Symbols

**Problem:**
```mad
flow
# start -> process  // Invalid symbol
% decision -> end  // Invalid symbol
```

**Solution:**
```mad
flow
@ start -> process    // Valid: @ for start
? decision -> end     // Valid: ? for decision
! end                 // Valid: ! for end
□ process            // Valid: □ for process
```

### Unclosed Labels

**Problem:**
```mad
flow
node: "Unclosed quote -> next
node: 'Single quote mismatch"
```

**Solution:**
```mad
flow
node: "Properly closed quote" -> next
node: 'Consistent quote type' -> next
node: Simple label without quotes -> next
```

### Chain Syntax Errors

**Problem:**
```mad
flow
A -> -> B        // Double arrow
A -> B -> -> C   // Missing node
A ->-> B         // No spaces
```

**Solution:**
```mad
flow
A -> B -> C      // Correct chaining
A -> intermediate -> B -> C  // Add missing nodes
A -> B -> C      // Proper spacing
```

## Output Problems

### Generated Mermaid Not Rendering

**Problem:** Mermaid Live Editor shows syntax errors

**Diagnosis:**
```bash
# Check output format
node dist/cli.js input.mad -o output.mmd
cat output.mmd
```

**Common Issues and Fixes:**

1. **Invalid Mermaid Node IDs**
   ```mad
   // Problem: Spaces in node names
   flow
   user login -> validate
   
   // Solution: Use underscores or quotes
   flow
   user_login -> validate
   // or
   "user login" -> validate
   ```

2. **Reserved Keywords**
   ```mad
   // Problem: Using Mermaid reserved words
   flow
   class -> end
   
   // Solution: Use different names or quotes  
   flow
   user_class -> completion
   // or
   "class" -> "end"
   ```

3. **Special Characters**
   ```mad
   // Problem: Unescaped special characters
   flow
   step1: Process & validate -> step2
   
   // Solution: Use quotes for special chars
   flow
   step1: "Process & validate" -> step2
   ```

### Incorrect Node Types

**Problem:** Nodes not showing as expected shape

**Diagnosis:**
```mad
// Check if smart inference is working
flow
login -> validate -> success  // Should auto-detect types

// Force specific types if needed
flow
@ login -> ? validate -> ! success
```

### Missing Connections

**Problem:** Some arrows not appearing in output

**Check for:**
1. Typos in node names
2. Case sensitivity issues
3. Spacing problems

**Solution:**
```mad
// Ensure consistent node naming
flow
user_Login -> validate_User -> success  // Inconsistent case
user_login -> validate_user -> success  // Consistent case
```

## Performance Issues

### Slow Processing

**Problem:** Large diagrams take too long to process

**Solutions:**
1. **Break into smaller diagrams**
   ```mad
   // Instead of one huge diagram
   // Create multiple focused diagrams
   
   // main-flow.mad
   flow
   @ start -> module_a -> module_b -> ! end
   
   // module-a-detail.mad  
   flow
   @ module_a_start -> step1 -> step2 -> ! module_a_end
   ```

2. **Optimize chaining**
   ```mad
   // Inefficient: Many separate connections
   flow
   A -> B
   B -> C  
   C -> D
   D -> E
   
   // Efficient: Use chaining
   flow
   A -> B -> C -> D -> E
   ```

### Memory Issues

**Problem:** Out of memory errors with large files

**Solutions:**
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 dist/cli.js large-file.mad

# Process files in smaller chunks
split -l 100 large-file.mad chunk_
for chunk in chunk_*; do
  node dist/cli.js "$chunk" -o "${chunk}.mmd"
done
```

## Feature Not Working

### Smart Inference Not Working

**Problem:** Node types not being inferred correctly

**Debug Steps:**
1. Check naming patterns
   ```mad
   // These should auto-detect
   flow
   start_process -> validate_input -> complete_task
   ```

2. Verify keywords
   ```mad
   // Common patterns that should work
   flow
   begin -> check -> decide -> finish
   login -> verify -> success
   ```

3. Override with explicit symbols if needed
   ```mad
   flow
   @ explicit_start -> auto_detect -> ! explicit_end
   ```

### Chaining Not Working

**Problem:** Chained connections not parsing correctly

**Debug:**
```mad
// Test simple chain first
flow
A -> B -> C

// Then add complexity
flow  
@ start -> validate -> ? decision -> ! end
decision -> error -> start: retry
```

### Comments Being Parsed

**Problem:** Comments appearing in output

**Check syntax:**
```mad
flow
// This is correct comment syntax
start -> end  // End of line comment

/* This might not work */ start -> end
# This won't work either
```

## Integration Problems

### VS Code Integration

**Problem:** VS Code not recognizing .mad files

**Solution:**
1. Add file association in VS Code settings:
   ```json
   {
     "files.associations": {
       "*.mad": "plaintext"
     }
   }
   ```

2. Install language extensions for better support

### CI/CD Integration

**Problem:** Build pipeline failing

**Solution:**
```yaml
# GitHub Actions example
- name: Generate Diagrams
  run: |
    npm install
    npm run build
    find . -name "*.mad" -exec node dist/cli.js {} -o {}.mmd \;
```

### Mermaid Live Editor Issues

**Problem:** Generated code not working in Mermaid Live

**Check:**
1. Copy exact output from MermaidAid
2. Verify no extra characters or formatting
3. Test with simple diagram first

## Debugging Techniques

### Enable Debug Output

**Add debug logging:**
```bash
# Set environment variable for verbose output
DEBUG=mermaidaid node dist/cli.js input.mad
```

### Validate Step by Step

**Test incremental complexity:**
```mad
// Step 1: Basic diagram
flow
A -> B

// Step 2: Add node types  
flow
@ A -> B -> ! C

// Step 3: Add branching
flow
@ A -> B -> ? C -> ! D
C -> E -> A: retry

// Step 4: Add labels
flow
@ A: Start -> B: Process -> ? C: Decision -> ! D: Complete
C -> E: Error -> A: Retry
```

### Common Error Patterns

**Pattern 1: Missing spaces**
```mad
// Wrong
A->B->C
// Right  
A -> B -> C
```

**Pattern 2: Invalid combinations**
```mad
// Wrong
flow seq
// Right
flow
```

**Pattern 3: Inconsistent quotes**
```mad
// Wrong
node: "Mixed quote types'
// Right
node: "Consistent quotes"
```

## Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Verify your syntax against the [Language Reference](language-reference.md)
3. Test with a minimal example
4. Check the generated Mermaid output manually

### Reporting Issues

**Include in your report:**
1. MermaidAid version
2. Node.js version
3. Complete .mad input file
4. Expected output
5. Actual output
6. Error messages

**Example bug report:**
```
Environment:
- MermaidAid: v1.0.0
- Node.js: v18.0.0
- OS: macOS 12.0

Input file (test.mad):
```mad
flow
@ start -> process -> ! end
```

Expected: Start and end nodes should be rounded
Actual: All nodes are rectangles

Command: node dist/cli.js test.mad
Error: No error, but output incorrect
```

### Community Resources

- GitHub Issues: Report bugs and feature requests
- Documentation: Check latest docs for updates
- Examples: Review working examples for patterns
