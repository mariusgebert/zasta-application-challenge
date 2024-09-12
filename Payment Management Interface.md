# Frontend Coding Challenge: Payment Management Interface

## **Overview**
Develop a frontend interface for an e-commerce platform's Payment Management page. The platform handles payments from users to merchants, with automatic splitting of payments into various fees and the remaining amount sent to the merchant. This challenge focuses on manually assigning unmatched payments to invoices and verifying the payment splits.

## **Scenario**
In this scenario, a payment was received but could not be automatically matched to an invoice. However, the sender's name was found in the database. The task is to create an interface that allows the assignment of this payment to an invoice and manually specify the payment splits.

## **Features to Implement**
1. **Payment Details Input**
   - Display payment information, including:
     - Payment amount
     - Sender name
     - Reference number
   - Allow the user to search for and select an invoice to assign the payment to.

2. **Fee and Amount Splitting**
   - Input fields for the following fee types:
     - Platform fee
     - Payment provider fee
     - Logistics fee
   - Calculate the remaining amount to be sent to the merchant after deducting the fees.

3. **Double-Check Mechanism**
   - Provide a summary of the assigned splits and total amounts.
   - A confirmation step for users to review and confirm the correctness of the split before finalizing the payment assignment.

4. **User Experience Considerations**
   - Clear error messages for invalid inputs or missing data.
   - Responsive design for usability across various devices.

## **UI Components**
- **Payment Detail Form:** Displays payment details and allows users to input or select the invoice.
- **Fee Splitter:** Input fields for the platform fee, payment provider fee, logistics fee, and remaining merchant amount.
- **Summary Section:** A clear display of the total payment, individual fees, and the remaining amount, with a confirmation button.
- **Error Messages:** Notifications for issues like invalid invoice numbers or incorrect fee calculations.

## **Technology Requirements**
- **Framework:** Use a modern frontend framework/library such as React, Angular, or Vue.js.
- **State Management:** Implement state management for handling user inputs and payment data.
- **Validation:** Ensure input fields are validated for correct data types and values.

## **Bonus Points**
- Implement a search autocomplete feature for selecting invoices.
- Use a modal or a similar UI component for the confirmation step.
- Provide clear and concise documentation of the code and user interface.

## Submission Guidelines
- **Deliverables:** A repository with the frontend code, a README file explaining the setup process, and any additional documentation.
- **Evaluation Criteria:** Code quality, UI/UX design