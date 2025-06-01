# App Blueprint Context File

---

## **1. Project Breakdown**

### **App Name:** HabitSync

### **Platform:** Web

### **App Summary:**
HabitSync is a comprehensive web-based app designed to help users track and analyze their daily habits, including expenses, sleep, mood, energy levels, calorie intake, journaling, and to-do lists. The app integrates these features into a single platform, enabling users to identify patterns and correlations between their habits and overall well-being. By providing actionable insights, HabitSync empowers users to make informed decisions to improve their lifestyle and productivity.

### **Primary Use Case:**
HabitSync is a **productivity and wellness tool** that focuses on habit tracking, self-reflection, and personal growth. Its core function is to provide users with a centralized platform to monitor and analyze their daily activities and their impact on mood and energy levels.

### **Authentication Requirements:**
- **User Accounts:** Yes, users need accounts to save and sync their data across devices.
- **Guest Users:** No, guest access is not required as personal data tracking is the core feature.
- **Social Login Options:** Google, Apple, and email/password login.
- **User Roles:** Single user role (general users). No admin or creator roles are needed.

#### **Tech Stack Overview**
| Category       | Web (Next.js)                                  |
|---------------|------------------------------------------------|
| **Frontend**  | React + Next.js                               |
| **UI Library** | Tailwind CSS + ShadCN                         |
| **Backend (BaaS)** | Supabase (data storage, real-time features) |
| **Deployment** | Vercel                                        |

---

## **2. Core Features**

1. **Daily Expense Tracker:**
   - Log daily expenses with categories (e.g., food, transport, entertainment).
   - Visualize spending trends with charts and graphs.

2. **Sleep Tracker:**
   - Log sleep duration and quality.
   - Provide insights into sleep patterns and recommendations.

3. **Mood and Energy Tracker:**
   - Log mood and energy levels throughout the day.
   - Correlate mood/energy with other tracked habits.

4. **Calorie Tracker:**
   - Log daily calorie intake.
   - Provide nutritional insights and trends.

5. **Daily Journal:**
   - Allow users to write and save journal entries.
   - Tag entries with moods or habits for better organization.

6. **To-Do List:**
   - Create and manage daily tasks.
   - Integrate with other features (e.g., mark tasks as completed in the journal).

7. **Habit Insights Dashboard:**
   - Visualize correlations between habits, mood, and energy levels.
   - Provide actionable recommendations for improvement.

---

## **3. User Flow**

1. **Onboarding:**
   - User signs up or logs in using social login or email.
   - Guided setup to configure initial preferences (e.g., time zone, goals).

2. **Daily Tracking:**
   - User logs expenses, sleep, mood, energy, calories, and journal entries.
   - Completes tasks from the to-do list.

3. **Data Visualization:**
   - User views insights and trends on the dashboard.
   - Explores correlations between habits and mood/energy.

4. **Reflection and Planning:**
   - User reviews journal entries and to-do list.
   - Adjusts habits or sets new goals based on insights.

---

## **4. Design and UI/UX**

### **Visual Design:**
- **Color Palette:** Calming and neutral tones (e.g., soft blues, greens, and grays).
- **Typography:** Clean and modern sans-serif fonts (e.g., Inter or Roboto).
- **Icons:** Minimalistic and consistent iconography for easy navigation.

### **User Experience:**
- **Intuitive Navigation:** Use a bottom navigation bar or sidebar for quick access to features.
- **Progressive Onboarding:** Provide tooltips and tutorials for first-time users.
- **Responsive Design:** Ensure the app is fully functional on both desktop and mobile browsers.
- **Accessibility:** Follow WCAG guidelines for color contrast, font size, and keyboard navigation.

---

## **5. Technical Implementation**

### **Frontend:**
- Use **Next.js** for server-side rendering and static site generation.
- Implement **Tailwind CSS** for utility-first styling and **ShadCN** for pre-built UI components.
- Use **React Query** for data fetching and state management.

### **Backend:**
- Use **Supabase** for authentication, database, and real-time updates.
- Store user data in a relational database (PostgreSQL) with tables for expenses, sleep, mood, calories, journal entries, and to-do lists.

### **Data Visualization:**
- Use **Chart.js** or **D3.js** for interactive charts and graphs on the dashboard.

### **Deployment:**
- Deploy the app on **Vercel** for seamless CI/CD and scalability.

---

## **6. Workflow Links and Setup Instructions**

### **Tools and Resources:**
- **Code Repository:** GitHub (private or public, depending on project requirements).
- **Project Management:** Trello or Notion for task tracking.
- **Design Tools:** Figma for UI/UX design and prototyping.
- **API Documentation:** Supabase API docs for backend integration.

### **Setup Instructions:**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/habitsync.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file and add Supabase credentials.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Deploy to Vercel:
   - Connect the GitHub repository to Vercel.
   - Configure environment variables in the Vercel dashboard.
   - Deploy the app.

---

This blueprint provides a clear roadmap for building HabitSync, ensuring alignment with the user's vision and technical requirements.