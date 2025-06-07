# Natural Language Style

Learn how to use MermaidAid's natural language features to create diagrams that read like plain English.

## Overview

MermaidAid supports natural language constructs that make diagrams more intuitive and accessible to non-technical stakeholders. This feature allows you to write workflows that read like written instructions while still generating precise technical diagrams.

## Natural Language Keywords

### Conditional Expressions
- `when` - Starts a conditional flow
- `if` - Conditional check
- `then` - Positive outcome
- `else` - Negative outcome

### Flow Control
- `and` - Sequential operations
- `or` - Alternative paths
- `while` - Repeated operations
- `until` - Loop termination

## Basic Natural Language Syntax

### Simple Conditionals
```mad
flow
when user opens app
if credentials are valid
then show dashboard
else show login screen
```

### Sequential Operations
```mad
flow
when order is placed
validate payment information
and check inventory levels
and calculate shipping costs
then process order
```

### Alternative Paths
```mad
flow
when document is uploaded
if format is PDF or format is DOC
then process document
else show format error
```

## Advanced Natural Language Patterns

### Complex Business Logic
```mad
flow
when customer submits support ticket
if priority is high
then assign to senior agent immediately
else if priority is medium
then add to standard queue
else add to low priority queue

when agent receives ticket
if issue is resolved within SLA
then close ticket and send satisfaction survey
else escalate to supervisor
```

### Multi-Step Processes
```mad
flow
when user wants to reset password
validate email address exists
and send reset token to email
and wait for user to click link

when user clicks reset link
if token is valid and not expired
then show password reset form
and validate new password strength
and update password in database
and send confirmation email
then redirect to login page
else show error message
```

### Error Handling Flows
```mad
flow
when API request is received
validate request format
and authenticate user
and authorize access

if any validation fails
then return error response
and log security event
else process request normally

when processing request
if database is unavailable
then return service unavailable
and trigger alert
else return successful response
```

## Hybrid Syntax (Natural + Symbolic)

### Combining Natural Language with Symbols
```mad
flow
@ when user starts checkout process

validate cart contents
and check user authentication

? if user is logged in
then proceed to payment: yes
else redirect to login: no

when payment is processed
if payment successful
then ! order confirmed: send confirmation
else ! payment failed: show error
```

### Business Process Documentation
```mad
flow
// Employee onboarding workflow
@ when new employee starts

HR completes initial paperwork
and IT creates user accounts
and manager assigns workspace

? if all setup is complete
then begin orientation program
and schedule first week meetings
and ! onboarding started: ready to work
else identify missing items
and complete remaining setup tasks
```

## Natural Language with Smart Inference

### Leveraging Both Features
```mad
flow
when customer calls support
agent_receives_call -> verify_customer_identity

if identity_verified
then access_customer_record
and review_account_history
and determine_issue_type

if issue_is_technical
then transfer_to_technical_team
else if issue_is_billing  
then transfer_to_billing_team
else handle_general_inquiry

when issue_is_resolved
update_customer_record
and send_followup_email
and close_support_ticket
```

## Document-Style Diagrams

### Standard Operating Procedure
```mad
flow
// Customer Service SOP v2.1

when customer contacts support
greet_customer_professionally
and gather_basic_information

if customer_is_existing
then lookup_account_details
else create_new_customer_record

identify_primary_concern
and categorize_issue_type

if issue_requires_escalation
then transfer_to_specialist
and provide_context_to_specialist  
else attempt_to_resolve_directly

when issue_is_resolved
confirm_resolution_with_customer
and document_interaction
and schedule_followup_if_needed
```

### Policy Implementation
```mad
flow
// Data Security Policy Implementation

when sensitive_data_is_accessed
verify_user_authorization
and log_access_attempt
and validate_security_clearance

if access_is_authorized
then grant_data_access
and monitor_usage_patterns
and enforce_time_limits
else deny_access_request
and notify_security_team
and log_security_violation

when data_session_ends
secure_data_cleanup
and update_access_logs
and verify_no_data_retention
```

## Best Practices

### 1. Consistent Language Style

**✅ Good: Consistent natural language**
```mad
flow
when user submits form
if all fields are completed
then validate field formats
and check business rules
else highlight missing fields
and request completion
```

**❌ Poor: Mixed styles**
```mad
flow
when user submits form
submit -> validate
? complete: done?
complete -> success: yes
complete -> error: no
```

### 2. Clear Action Verbs

**✅ Good: Clear actions**
```mad
flow
when order arrives
verify_package_contents
and check_for_damage
and update_inventory_system
and notify_customer_of_delivery
```

**❌ Poor: Vague actions**
```mad
flow
when order arrives
check_stuff
and do_things
and update_system
```

### 3. Logical Flow Structure

**✅ Good: Logical progression**
```mad
flow
when payment is initiated
validate_payment_method
and verify_available_funds
and process_transaction

if transaction_succeeds
then update_account_balance
and send_confirmation_receipt
else handle_payment_failure
and notify_customer_of_error
```

## Integration Examples

### Requirements Documentation
```mad
flow
// User Registration Requirements

when user wants to create account
if user provides valid email
and password meets security requirements
and agrees to terms of service
then create user account
and send verification email
and redirect to welcome page
else display appropriate error message
and allow user to correct information
```

### Testing Scenarios
```mad
flow
// Login Test Scenario

when test user attempts login
if username exists in test database
and password matches stored hash
and account is not locked
then grant access to test environment
and log successful test login
else record test failure details
and continue with negative test cases
```

### API Documentation
```mad
flow
// Authentication API Flow

when client requests authentication
validate request format
and check required parameters

if credentials are provided
then verify username and password
and check account status
and generate access token
else return authentication error

when token is generated
set expiration time
and store in session cache
and return token to client
```

## Natural Language Reference

### Supported Keywords

| Keyword | Usage | Example |
|---------|-------|---------|
| `when` | Event trigger | `when user clicks button` |
| `if` | Condition check | `if data is valid` |
| `then` | Positive outcome | `then proceed to next step` |
| `else` | Negative outcome | `else show error message` |
| `and` | Sequential operation | `validate and save data` |
| `or` | Alternative condition | `if admin or manager` |
| `while` | Continuous operation | `while processing continues` |
| `until` | Loop termination | `retry until successful` |

### Grammar Patterns

- **Event-driven**: `when [event] [action]`
- **Conditional**: `if [condition] then [action] else [action]`
- **Sequential**: `[action] and [action] and [action]`
- **Alternative**: `[action] or [action]`

## Common Use Cases

### Business Process Documentation
```mad
flow
when monthly report is due
gather_data_from_all_departments
and compile_financial_summary
and create_executive_presentation

if all_data_is_available
then finalize_report_by_deadline
else identify_missing_information
and follow_up_with_departments
and adjust_timeline_if_necessary
```

### User Experience Flows
```mad
flow
when user visits checkout page
if shopping_cart_has_items
then display_order_summary
and show_payment_options
and calculate_total_with_taxes
else redirect_to_shopping_cart
and suggest_popular_products

when user_selects_payment_method
if payment_information_is_valid
then process_order_immediately
else highlight_invalid_fields
and provide_correction_guidance
```

### System Integration Flows
```mad
flow
when external_system_sends_data
validate_data_format
and check_authentication_token
and verify_data_integrity

if all_validations_pass
then transform_data_to_internal_format
and store_in_primary_database
and update_dependent_systems
and send_acknowledgment_response
else log_validation_errors
and return_detailed_error_response
```

Natural language style makes MermaidAid diagrams accessible to broader audiences while maintaining the precision needed for technical implementation. This approach bridges the gap between business requirements and technical specifications.
