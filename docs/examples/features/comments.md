# Comments and Documentation

Learn how to effectively document your MermaidAid diagrams using comments, making them self-explaining and maintainable.

## Overview

Comments in MermaidAid serve multiple purposes: explaining complex logic, providing context for business rules, documenting maintenance notes, and creating self-documenting diagrams that serve as both technical specifications and business documentation.

## Comment Syntax

### Basic Comment Types

#### Line Comments
```mad
flow
// This is a full-line comment
start -> process  // End-of-line comment
```

#### Multi-line Comments
```mad
flow
// This is a multi-line comment
// that spans several lines
// to explain complex logic
start -> process -> end
```

#### Section Headers
```mad
flow
// ==========================================
// USER AUTHENTICATION WORKFLOW
// ==========================================
// Version: 2.1
// Last updated: 2025-01-15
// Owner: Security Team
// ==========================================

@ user_login: User Login Attempt
user_login -> validate_credentials
```

## Documentation Patterns

### Business Context Documentation
```mad
flow
// Customer Order Processing Workflow
// 
// Business Rules:
// - Orders over $500 require manager approval
// - International orders need additional verification
// - Peak season orders have expedited processing
//
// Integration Points:
// - Payment Gateway: Stripe API v3
// - Inventory System: SAP integration
// - Shipping: FedEx and UPS APIs

@ new_order: Customer Places Order
new_order -> validate_order_details

// Validate basic order information
validate_order_details -> ? order_amount: Order Value?

// High-value orders need approval (business rule #1)
order_amount -> manager_approval: over $500 -> ? approval_decision
order_amount -> check_inventory: under $500

// Manager approval process
approval_decision -> process_order: approved
approval_decision -> ! order_rejected: denied

// Standard order processing
check_inventory -> ? inventory_available: Items in Stock?
inventory_available -> process_payment: yes
inventory_available -> backorder_process: no -> notify_customer
```

### Technical Implementation Notes
```mad
flow
// API Request Processing Pipeline
//
// Technical Notes:
// - All requests must be authenticated via JWT tokens
// - Rate limiting: 1000 requests/hour per API key
// - Timeout: 30 seconds for external API calls
// - Retry policy: 3 attempts with exponential backoff
//
// Error Codes:
// - 400: Invalid request format
// - 401: Authentication failed
// - 429: Rate limit exceeded
// - 503: External service unavailable

@ api_request: Incoming API Request

// Security layer - JWT validation required
api_request -> validate_jwt_token: Authenticate request
validate_jwt_token -> ? token_valid: Valid Token?
token_valid -> ! unauthorized_error: no, return 401

// Rate limiting check (Redis-based counter)
token_valid -> check_rate_limit: yes
check_rate_limit -> ? within_limit: Under Rate Limit?
within_limit -> ! rate_limit_error: no, return 429

// Main processing pipeline
within_limit -> parse_request: yes
parse_request -> ? request_valid: Valid Format?
request_valid -> ! bad_request_error: no, return 400

// External API integration with retry logic
request_valid -> call_external_api: yes
call_external_api -> ? api_response: External API Success?
api_response -> format_response: success -> ! api_success: return 200
api_response -> retry_api_call: timeout/error -> ? retry_count: Retry Available?
retry_count -> call_external_api: yes, attempt retry
retry_count -> ! service_unavailable: no, return 503
```

### Maintenance and Version Information
```mad
flow
// Employee Onboarding Process v3.2
// 
// Change Log:
// v3.2 (2025-01-15) - Added remote work setup branch
// v3.1 (2024-12-01) - Simplified equipment assignment
// v3.0 (2024-10-15) - Major restructure for hybrid work
//
// Known Issues:
// - IT setup can take 2-3 days during peak hiring
// - Manager assignment needs manual verification
// - Badge creation requires 24-hour advance notice
//
// Dependencies:
// - HR System: Workday integration
// - IT Systems: Active Directory, ServiceNow
// - Facilities: Badge system, parking assignment

@ new_hire_starts: New Employee First Day

// Week 1: Administrative setup
new_hire_starts -> hr_orientation: Complete HR paperwork
hr_orientation -> it_setup: Technology provisioning
it_setup -> ? work_location: Remote or Office?

// Office-based employee setup
work_location -> office_setup: office -> assign_desk -> create_badge -> parking_assignment

// Remote employee setup (added in v3.2)
work_location -> remote_setup: remote -> ship_equipment -> virtual_tour -> ! remote_ready

// Common path continues
office_setup -> manager_introduction
remote_ready -> manager_introduction

manager_introduction -> department_overview -> first_week_schedule -> ! onboarding_complete

// Error handling and exceptions
it_setup -> it_delay: equipment unavailable -> escalate_to_it_manager -> it_setup: retry
create_badge -> badge_delay: badge system down -> temporary_escort_badge -> create_badge: retry next day
```

## Comment Organization Strategies

### Hierarchical Documentation
```mad
flow
// ############################################
// MAIN SECTION: Order Fulfillment Process
// ############################################

// ==========================================
// SUBSECTION: Order Validation
// ==========================================
@ order_received: New Order
order_received -> validate_customer_info  // Check customer exists in CRM
validate_customer_info -> validate_payment_method  // Verify payment details

// ==========================================  
// SUBSECTION: Inventory Management
// ==========================================
validate_payment_method -> check_inventory
check_inventory -> ? stock_available: Items Available?

// ------------------------------------------
// BRANCH: Sufficient Inventory
// ------------------------------------------
stock_available -> allocate_inventory: yes
allocate_inventory -> reserve_items  // Lock inventory for 30 minutes
reserve_items -> calculate_shipping

// ------------------------------------------
// BRANCH: Insufficient Inventory  
// ------------------------------------------
stock_available -> backorder_process: no
backorder_process -> estimate_restock_date  // Check with suppliers
estimate_restock_date -> notify_customer_delay
```

### Workflow Annotations
```mad
flow
// Customer Support Ticket Workflow
// SLA Requirements: 
// - P1 (Critical): 1 hour response, 4 hour resolution
// - P2 (High): 4 hour response, 24 hour resolution  
// - P3 (Medium): 1 day response, 3 day resolution
// - P4 (Low): 3 day response, 1 week resolution

@ ticket_created: Customer Submits Ticket

// Initial triage (should complete within 15 minutes)
ticket_created -> auto_categorize: automated initial categorization
auto_categorize -> ? priority_level: Determine Priority

// P1 Critical path (1 hour SLA)
priority_level -> p1_immediate_response: P1 Critical
p1_immediate_response -> senior_engineer_assignment  // Escalate immediately
senior_engineer_assignment -> ! p1_in_progress: Start resolution timer

// P2 High priority path (4 hour SLA)  
priority_level -> p2_queue: P2 High -> standard_engineer_assignment
standard_engineer_assignment -> ! p2_in_progress: Begin work

// P3/P4 Standard processing (1+ day SLA)
priority_level -> standard_queue: P3/P4 -> queue_for_next_available
queue_for_next_available -> ! standard_in_progress: Assigned to agent

// Resolution tracking for all priorities
p1_in_progress -> resolution_process: Work on solution
p2_in_progress -> resolution_process
standard_in_progress -> resolution_process

resolution_process -> ? sla_status: Within SLA?
sla_status -> customer_notification: yes -> ! ticket_resolved
sla_status -> escalation_required: no, SLA breach -> management_review
```

### Reference Documentation
```mad
flow
// Payment Processing Integration
//
// External Systems:
// - Stripe: Credit card processing (Primary)
// - PayPal: Alternative payment method
// - Bank API: ACH transfers for large amounts
// - Fraud Service: MaxMind for risk assessment
//
// Business Logic:
// - Credit cards: Immediate processing
// - PayPal: 2-3 day settlement
// - ACH: 5-7 business days
// - All payments >$10k require manual review
//
// Error Handling:
// - Declined cards: Allow 3 retry attempts
// - Fraud alerts: Immediate hold + manual review
// - Gateway timeouts: Retry after 30 seconds
// - Multiple failures: Disable payment method temporarily

@ payment_initiated: Customer Submits Payment

// Gateway selection logic
payment_initiated -> ? payment_method: Payment Type?

// Credit card path (Stripe integration)
payment_method -> stripe_processing: credit card
stripe_processing -> fraud_check: MaxMind risk assessment
fraud_check -> ? fraud_score: Risk Level?
fraud_score -> process_payment: low risk -> ! payment_complete
fraud_score -> manual_review: high risk -> ! payment_hold

// PayPal path (PayPal SDK)
payment_method -> paypal_processing: paypal -> paypal_redirect
paypal_redirect -> paypal_callback -> ! payment_pending: 2-3 day settlement

// ACH path (Bank API integration)
payment_method -> ach_processing: bank transfer
ach_processing -> ? amount_check: Amount > $10,000?
amount_check -> manual_approval: yes -> approval_queue -> ! payment_pending
amount_check -> ach_submit: no -> bank_api_call -> ! payment_pending: 5-7 days
```

## Advanced Documentation Techniques

### Conditional Logic Documentation
```mad
flow
// Dynamic Pricing Algorithm
// 
// Pricing Rules (in order of precedence):
// 1. VIP customers: 15% discount always
// 2. Bulk orders (100+ items): 10% discount  
// 3. Seasonal promotions: Variable discount
// 4. New customer: 5% welcome discount
// 5. Loyalty program: Points-based discount
//
// Special Cases:
// - Sale items: Cannot be combined with other discounts
// - Minimum order: $25 for discount eligibility
// - International: Add 15% for shipping/duties

@ calculate_price: Price Calculation Request

calculate_price -> base_price_lookup: Get product base price
base_price_lookup -> ? customer_type: Customer Classification?

// Rule #1: VIP customer override (highest precedence)
customer_type -> vip_pricing: VIP -> apply_vip_discount: 15% off -> ! final_price

// Rule #2: Bulk order discount (second precedence)  
customer_type -> check_quantity: Regular -> ? bulk_order: 100+ items?
bulk_order -> bulk_discount: yes -> apply_bulk_discount: 10% off -> ! final_price

// Rules #3-5: Standard discount evaluation (lower precedence)
bulk_order -> seasonal_check: no -> ? seasonal_promotion: Active promotion?
seasonal_check -> new_customer_check: no promotion -> ? new_customer: First order?
new_customer_check -> loyalty_check: not new -> ? loyalty_points: Sufficient points?

// Apply appropriate discount
seasonal_promotion -> apply_seasonal: yes -> ! final_price
new_customer -> apply_welcome: yes -> ! final_price  
loyalty_points -> apply_loyalty: yes -> ! final_price
loyalty_points -> ! no_discount: no -> final_price: standard pricing
```

### Error Handling Documentation
```mad
flow
// File Upload and Processing Pipeline
//
// Supported Formats: PDF, DOC, DOCX, TXT (max 10MB)
// Processing Time: Small files (<1MB) = instant, Large files = 30-60 seconds
// 
// Error Recovery:
// - Network timeouts: Auto-retry 3 times with backoff
// - Virus detection: Quarantine + notify security team
// - Format errors: Provide specific format requirements
// - Size limits: Suggest compression or splitting
//
// Monitoring:
// - Success rate target: 99.5%
// - Processing time alert: >90 seconds
// - Error rate alert: >1% in 5-minute window

@ file_upload: User Uploads File

// Input validation phase
file_upload -> ? file_size: Check File Size
file_size -> ! size_error: >10MB -> "File too large. Max size: 10MB. Try compressing or splitting the file."

file_size -> format_validation: <=10MB -> ? supported_format: Valid Format?
supported_format -> ! format_error: no -> "Unsupported format. Please use: PDF, DOC, DOCX, or TXT"

// Security scanning phase  
supported_format -> virus_scan: yes -> ? clean_file: Virus Free?
clean_file -> ! security_alert: no -> quarantine_file -> notify_security_team
// Alert: "File quarantined due to security concerns. Incident #${id} created."

// Processing phase (with timeout handling)
clean_file -> start_processing: yes -> set_timeout: 90 second timeout
start_processing -> ? processing_result: Processing Complete?

// Success path
processing_result -> extract_metadata: success -> store_file -> ! upload_complete

// Timeout handling (with retry logic)
processing_result -> timeout_handler: timeout -> ? retry_count: Retry Available?
retry_count -> start_processing: <3 retries -> "Retrying... (attempt ${count}/3)"
retry_count -> ! processing_failed: >=3 retries -> "Processing failed after 3 attempts. Please try again later."

// Processing error handling
processing_result -> ? error_type: processing error
error_type -> ! corrupted_file: corrupted -> "File appears corrupted. Please re-upload."
error_type -> ! extraction_failed: extraction -> "Unable to extract content. Verify file integrity."
error_type -> ! unknown_error: other -> "Unexpected error. Support has been notified. Ref: ${errorId}"
```

## Documentation Best Practices

### 1. Layer Documentation by Audience

**Executive Summary** (for stakeholders):
```mad
flow
// Executive Summary: Customer Onboarding Process
// 
// Business Impact:
// - Reduces onboarding time from 3 weeks to 1 week
// - Improves customer satisfaction by 40%
// - Decreases support tickets by 60%
// - Automated steps save 15 hours/week of manual work
//
// Key Metrics:
// - Time to First Value: <24 hours
// - Completion Rate: 95%
// - Customer Satisfaction: 4.8/5

// [Simplified high-level flow for executives]
@ customer_signup -> automated_setup -> guided_tour -> ! customer_active
```

**Technical Details** (for developers):
```mad
flow
// Technical Implementation: Customer Onboarding
//
// Technology Stack:
// - Frontend: React + TypeScript
// - Backend: Node.js + Express
// - Database: PostgreSQL with Redis cache
// - Queue: AWS SQS for async processing
// - Email: SendGrid API
// - Analytics: Mixpanel for user tracking
//
// Performance Requirements:
// - API response time: <200ms (95th percentile)
// - Email delivery: <5 minutes
// - Database queries: <50ms average

// [Detailed technical flow with error handling]
@ signup_api_call -> validate_request -> create_user_record -> ! success_response
```

### 2. Version Control Integration
```mad
flow
// Version Control Comments
// Git commit: abc123f
// Branch: feature/payment-modernization  
// PR: #247 - Modernize payment processing
// Reviewer: @senior-dev, @payment-team-lead
//
// Breaking Changes:
// - Legacy payment API deprecated
// - New webhook endpoints required
// - Database schema migration needed
//
// Rollback Plan:
// - Keep legacy code for 30 days
// - Feature flag 'new_payment_system'
// - Rollback script: scripts/rollback-payment.sql

@ new_payment_flow -> validate_input -> process_payment -> ! response
```

### 3. Operational Runbooks
```mad
flow
// OPERATIONAL RUNBOOK: Payment Processing Alerts
//
// Alert Triggers:
// - Payment failure rate >5% in 5-minute window
// - Processing time >30 seconds average
// - External gateway timeout rate >1%
//
// Escalation Path:
// 1. Automated page to on-call engineer (immediate)
// 2. If not acked in 10 minutes -> page team lead
// 3. If not resolved in 30 minutes -> page director
//
// Common Issues & Solutions:
// - Gateway timeout: Check status.stripe.com, failover to backup
// - Database slow: Check connection pool, restart if needed
// - High failure rate: Check recent deploys, consider rollback

@ payment_alert_triggered: Alert: High Payment Failure Rate

// Immediate response (within 2 minutes)
payment_alert_triggered -> check_external_status: Verify gateway status
check_external_status -> ? gateway_healthy: External Systems OK?

// External issue path
gateway_healthy -> activate_backup_gateway: no -> update_status_page
activate_backup_gateway -> monitor_backup_performance -> ! external_issue_mitigated

// Internal issue path  
gateway_healthy -> check_recent_deployments: yes -> ? recent_deploy: Deploy in last hour?
recent_deploy -> consider_rollback: yes -> contact_deploy_engineer -> ! deploy_investigation
recent_deploy -> check_database_performance: no -> ? db_performance: DB metrics normal?

db_performance -> restart_database_connections: no -> ! database_issue_addressed
db_performance -> escalate_to_senior: yes -> ! escalation_required: "Unknown cause - senior engineer needed"
```

Comments and documentation in MermaidAid transform simple diagrams into comprehensive technical documentation that serves multiple audiences and use cases. Well-documented diagrams become living documentation that evolves with your processes and systems.
