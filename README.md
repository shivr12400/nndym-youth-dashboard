# NNDYM Youth Dashboard

## Project Overview

This project is a dynamic web dashboard designed for the NNDYM Youth program. It provides a centralized platform for managing and visualizing key data related to kids' attendance at satsangs, their interests in various activities, and leader information across different mandirs. The dashboard aims to provide actionable insights into youth engagement and participation trends, enabling better decision-making and program management.

## Key Features

*   **Mandir-specific Data:** Access and view data filtered by individual mandirs.
*   **Kids Attendance Tracking:** Submit and monitor weekly satsang attendance counts.
*   **Leader Information Management:** View and update contact details for mandir leaders.
*   **Kids Registration:** Register new kids, capturing their demographic information and interests.
*   **Comprehensive Data Visualization:**
    *   **Age Distribution Chart:** Visualize the distribution of registered kids across different age groups.
    *   **Gender Distribution Chart:** Understand the gender breakdown of registered kids overall and within specific age groups.
    *   **Kids Over Time Chart:** Track total kids' attendance trends across all age groups over time.
    *   **Top Kids Activities Charts (Gender-separated):** Identify popular activities among kids, with participation broken down by gender for each age group, providing granular insights into interests.
*   **Upcoming Events Management:** View and submit details for future events.

## Technology Stack

*   **Frontend:** Next.js (React), Material-UI
*   **Backend/API:** Implied API endpoints for data persistence (e.g., AWS Amplify, Node.js/Express)
*   **Data Visualization:** Recharts
*   **State Management:** React Hooks (useState, useEffect, useMemo)

## Getting Started

Follow these steps to set up and run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd nndym-youth-dashboard
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Configure Environment Variables (if any):**
    *   If the project connects to a backend, ensure `apiInfo` in `utils/api.js` is correctly configured.
    *   Refer to `.env.example` or project documentation for required environment variables.
4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure (High-Level)

*   `components/`: Reusable UI components.
    *   `kids-attendance/`: Components specific to the kids attendance dashboard (e.g., charts, forms).
*   `hooks/`: Custom React Hooks for encapsulating reusable logic (e.g., `useKidsAttendance`).
*   `pages/`: Next.js pages (e.g., `index.js`, `kids-attendance.js`, `register.js`).
*   `public/`: Static assets.
*   `styles/`: Global styles and Material-UI theme configuration.
*   `utils/`: Utility functions (e.g., API calls, date calculations, activity processing).

## Contributing

Contributions are welcome! Please follow the project's code style and submit pull requests for new features or bug fixes.

## Support & Contact

For any questions or support, please contact the development team.

shiv.rathod@nndym.org

---