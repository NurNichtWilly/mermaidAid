# Best Practices Guide

Guidelines for creating maintainable, readable, and effective MermaidAid diagrams.

## Table of Contents

1. [Diagram Design Principles](#diagram-design-principles)
2. [Naming Conventions](#naming-conventions)
3. [Code Organization](#code-organization)
4. [Performance Guidelines](#performance-guidelines)
5. [Maintenance Strategies](#maintenance-strategies)
6. [Common Anti-Patterns](#common-anti-patterns)

## Diagram Design Principles

### 1. Start Simple, Add Complexity Gradually

**❌ Poor:** Complex diagram from the start
```mad
flow
@ start -> validate_input -> ? input_valid -> process_data -> ? data_correct -> transform_data -> ? transform_ok -> save_data -> ? save_success -> send_notification -> ? notification_sent -> audit_log -> ? log_written -> cleanup_temp -> ! complete
input_valid -> input_error: no -> format_error -> user_notification -> start: retry
data_correct -> data_error: no -> data_validation_error -> start: fix data
transform_ok -> transform_error: no -> rollback_data -> start: retry
save_success -> save_error: no -> rollback_transform -> start: retry
notification_sent -> notification_error: no -> log_error -> ! partial_success
log_written -> log_error: no -> ! complete_with_log_error
```

**✅ Good:** Build complexity in layers
```mad
// Layer 1: Core happy path
flow
@ start -> validate -> process -> save -> ! complete

// Layer 2: Add primary error handling
validate -> error: invalid -> start: retry
process -> error: failed -> start: retry

// Layer 3: Add detailed branching (separate diagram if needed)
save -> ? save_result
save_result -> notification: success -> audit -> ! complete
save_result -> retry_save: transient error -> save
save_result -> ! save_failed: permanent error
```

### 2. Use Consistent Abstraction Levels

**❌ Poor:** Mixing high-level and low-level details
```mad
flow
@ user_request -> validate_http_headers -> check_ssl_certificate -> parse_json_payload -> validate_json_schema -> authenticate_with_oauth2 -> check_rate_limits -> business_logic -> ! response
```

**✅ Good:** Consistent abstraction level
```mad
flow
@ user_request -> security_checks -> business_logic -> ! response
security_checks -> auth_failure: failed -> ! unauthorized
business_logic -> processing_error: failed -> ! error_response
```

### 3. Group Related Logic

**❌ Poor:** Scattered related logic
```mad
flow
@ start -> step1 -> step2 -> validation1 -> step3 -> validation2 -> step4 -> error_handling -> ! end
validation1 -> error_handling: failed
validation2 -> error_handling: failed
```

**✅ Good:** Grouped logical blocks
```mad
flow
// Main workflow
@ start -> preprocessing -> core_processing -> postprocessing -> ! complete

// Validation block
preprocessing -> validate_input -> validate_permissions
validate_input -> ! validation_error: invalid
validate_permissions -> ! access_denied: denied

// Error handling block
core_processing -> handle_errors: failed
handle_errors -> retry: recoverable -> core_processing
handle_errors -> ! processing_failed: critical
```

## Naming Conventions

### 1. Use Descriptive, Action-Oriented Names

**❌ Poor:** Vague or unclear names
```mad
flow
@ start -> check -> do_stuff -> check2 -> finish
check -> bad: no
check2 -> bad: no
```

**✅ Good:** Clear, descriptive names
```mad
flow
@ user_registration -> validate_email -> create_account -> send_welcome -> ! registration_complete
validate_email -> email_invalid: malformed -> user_registration: retry
create_account -> account_exists: duplicate -> user_registration: use different email
```

### 2. Leverage Smart Inference

**❌ Poor:** Fighting against smart inference
```mad
flow
@ begin_process: Start -> check_data -> finish_task: End
check_data -> fail_check: Invalid -> begin_process: Restart
```

**✅ Good:** Work with smart inference
```mad
flow
start_process -> validate_data -> complete_task
validate_data -> validation_error: invalid -> start_process: restart
```

### 3. Consistent Naming Patterns

**❌ Poor:** Inconsistent naming
```mad
flow
userLogin -> check_password -> validateSession -> Send_Email -> user_dashboard
```

**✅ Good:** Consistent naming convention
```mad
flow
user_login -> validate_password -> create_session -> send_notification -> user_dashboard
```

## Code Organization

### 1. Use Comments Effectively

**❌ Poor:** No comments or too many obvious comments
```mad
flow
start -> process -> end  // This processes data and ends
```

**✅ Good:** Strategic, meaningful comments
```mad
flow
// User onboarding workflow - handles new user registration and setup
@ user_signup: New User Registration

// Core validation steps
user_signup -> validate_email -> validate_password -> create_account

// Account setup and personalization
create_account -> setup_profile -> configure_preferences -> ! onboarding_complete

// Error recovery paths
validate_email -> email_error: invalid format -> user_signup: try again
validate_password -> password_error: too weak -> user_signup: strengthen password
create_account -> account_error: username taken -> user_signup: choose different name
```

### 2. Logical Grouping with Comments

**❌ Poor:** Flat structure without grouping
```mad
flow
@ start -> step1 -> step2 -> step3 -> step4 -> step5 -> step6 -> step7 -> ! end
step1 -> error1: fail
step3 -> error2: fail
step5 -> error3: fail
error1 -> start: retry
error2 -> start: retry
error3 -> start: retry
```

**✅ Good:** Grouped with clear sections
```mad
flow
// ===================
// INITIALIZATION PHASE
// ===================
@ application_start -> load_configuration -> initialize_database

// ===================
// PROCESSING PHASE  
// ===================
initialize_database -> validate_user_input -> process_business_logic -> generate_results

// ===================
// FINALIZATION PHASE
// ===================
generate_results -> save_to_storage -> send_notifications -> ! processing_complete

// ===================
// ERROR HANDLING
// ===================
load_configuration -> config_error: invalid -> ! startup_failed
initialize_database -> db_error: connection failed -> ! startup_failed
validate_user_input -> input_error: validation failed -> ! invalid_request
process_business_logic -> business_error: logic error -> ! processing_failed
```

### 3. Separate Complex Branches

**❌ Poor:** Everything in one diagram
```mad
flow
@ start -> step1 -> ? decision -> branch1 -> subbranch1a -> subsubbranch1a1 -> result1
decision -> branch2 -> subbranch2a -> subsubbranch2a1 -> result2
decision -> branch3 -> subbranch3a -> subsubbranch3a1 -> result3
// ... many more nested branches
```

**✅ Good:** Separate complex branches
```mad
// Main flow - high-level overview
flow
@ order_received -> validate_order -> ? order_type -> process_order -> ! order_complete
order_type -> standard_processing: standard
order_type -> express_processing: express  
order_type -> bulk_processing: bulk

// Standard processing flow (separate .mad file)
// @ standard_start -> standard_step1 -> standard_step2 -> ! standard_complete

// Express processing flow (separate .mad file)
// @ express_start -> priority_queue -> fast_track -> ! express_complete
```

## Performance Guidelines

### 1. Optimize for Readability Over Brevity

**❌ Poor:** Too compact, hard to understand
```mad
flow
@ s -> v -> ? ok -> p -> s1 -> s2 -> s3 -> ! e
ok -> err -> s
```

**✅ Good:** Balance of compact and readable
```mad
flow
@ start -> validate -> ? validation_ok -> process -> save -> notify -> ! complete
validation_ok -> error_handler: failed -> start: retry
```

### 2. Use Chaining Strategically

**❌ Poor:** Excessive chaining that hurts readability
```mad
flow
@ start -> step1 -> step2 -> step3 -> step4 -> step5 -> step6 -> step7 -> step8 -> step9 -> step10 -> ! end
```

**✅ Good:** Balanced chaining with logical breaks
```mad
flow
// Logical groups with chaining
@ start -> initialize -> configure -> validate

// Next logical group
validate -> ? ready -> process -> transform -> save

// Final group
save -> cleanup -> notify -> ! complete

// Error handling
ready -> initialization_error: not ready -> start: restart
process -> processing_error: failed -> cleanup: emergency cleanup -> ! failed
```

### 3. Minimize Complex Intersections

**❌ Poor:** Many crossing connections
```mad
flow
A -> B -> C
A -> C -> D  
A -> D -> B
B -> D -> A
C -> A -> D
```

**✅ Good:** Organize to minimize crossings
```mad
flow
// Linear flow with clear branches
@ start -> step1 -> step2 -> step3 -> ! end

// Error paths grouped together
step1 -> error_handler: failed
step2 -> error_handler: failed  
step3 -> error_handler: failed
error_handler -> start: retry
error_handler -> ! failure: critical error
```

## Maintenance Strategies

### 1. Version Control Friendly

**❌ Poor:** Hard to track changes
```mad
flow
@ start -> step1 -> step2 -> step3 -> step4 -> step5 -> step6 -> step7 -> step8 -> step9 -> ! end
step1 -> error: fail
step3 -> error: fail  
step7 -> error: fail
error -> start: retry
```

**✅ Good:** Structured for easy diff tracking
```mad
flow
// Core workflow - v2.1
@ user_action -> validation_step -> processing_step -> completion_step -> ! success

// Validation phase
validation_step -> ? input_valid
input_valid -> validation_error: no -> user_action: retry
input_valid -> processing_step: yes

// Processing phase  
processing_step -> ? processing_success
processing_success -> processing_error: no -> user_action: retry
processing_success -> completion_step: yes

// Completion phase
completion_step -> ! success
```

### 2. Self-Documenting Structure

**❌ Poor:** Requires external documentation
```mad
flow
@ a -> b -> c -> d -> ! e
b -> x: f1
c -> y: f2  
d -> z: f3
```

**✅ Good:** Self-explaining through naming and structure
```mad
flow
// Customer support ticket workflow
@ ticket_created: Customer submits support ticket
ticket_created -> initial_triage -> ? urgency_level -> assign_to_team

urgency_level -> critical_team: high urgency
urgency_level -> standard_team: normal urgency
urgency_level -> low_priority_queue: low urgency

assign_to_team -> work_on_ticket -> ? resolution_found -> ! ticket_resolved
resolution_found -> escalate_ticket: no solution found -> assign_to_team: reassign
```

## Common Anti-Patterns

### 1. The "Spaghetti Diagram"

**❌ Avoid:** Tangled connections everywhere
```mad
flow
A -> B -> C -> A -> D -> B -> E -> C -> F -> A -> G -> E -> H -> D
```

**✅ Fix:** Clear, directional flow
```mad
flow
// Clear progression with minimal back-references
@ start -> phase1 -> phase2 -> phase3 -> ! complete
phase1 -> error_recovery: error -> start: restart
phase2 -> error_recovery: error
phase3 -> error_recovery: error
```

### 2. The "God Diagram"

**❌ Avoid:** One diagram trying to show everything
```mad
// 50+ nodes all in one diagram trying to show entire system
```

**✅ Fix:** Hierarchical decomposition
```mad
// High-level system overview
flow
@ system_start -> authentication -> main_application -> shutdown -> ! system_end

// Separate detailed diagrams for each major component:
// - authentication-flow.mad
// - main-application-flow.mad  
// - shutdown-procedure.mad
```

### 3. The "Cryptic Abbreviation"

**❌ Avoid:** Unclear abbreviations
```mad
flow
@ usr_req -> val_inp -> proc_biz_log -> ret_resp -> ! cmp
```

**✅ Fix:** Clear, readable names
```mad
flow
@ user_request -> validate_input -> process_business_logic -> return_response -> ! complete
```

### 4. The "No Error Handling"

**❌ Avoid:** Only happy path
```mad
flow
@ start -> step1 -> step2 -> step3 -> ! success
```

**✅ Fix:** Include error scenarios
```mad
flow
@ start -> step1 -> step2 -> step3 -> ! success
step1 -> error: failed -> start: retry
step2 -> error: failed -> start: retry  
step3 -> error: failed -> start: retry
error -> ! failure: max retries exceeded
```

## Review Checklist

Before finalizing a MermaidAid diagram, check:

- [ ] **Clarity**: Can someone unfamiliar understand the flow?
- [ ] **Completeness**: Are error cases and edge cases covered?
- [ ] **Consistency**: Is naming and style consistent throughout?
- [ ] **Maintainability**: Will this be easy to update later?
- [ ] **Appropriate Detail**: Is the abstraction level consistent?
- [ ] **Performance**: Does it generate clean, readable Mermaid output?
- [ ] **Documentation**: Are complex parts explained with comments?
