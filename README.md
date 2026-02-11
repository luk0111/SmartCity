🏙️ SmartCity
SmartCity is a modern full-stack application designed to help users discover essential services—from hotels to clinics—in major metropolitan areas. It also serves as a vibrant social platform, allowing users to interact with posts from fellow travelers and local businesses in a community-driven environment. It features a hybrid review system that aggregates real-time data from the Google Places API alongside a custom, internal user review platform.

🚀 Tech Stack
Backend: Java 21 (Spring Boot 3.x), Spring Security (JWT), Spring Data JPA.

Frontend: React (Vite + TypeScript), React-Spring (Physics-based animations).

## Database Setup
The project uses H2 in **File-Based Mode** with Auto-Server enabled. This allows you to view the database via IntelliJ or DBeaver while the app is running.

- **JDBC URL:** `jdbc:h2:file:./data/smartcity;AUTO_SERVER=TRUE`
- **User:** `sa`
- **Password:** `password`
- **H2 Console:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

**Note:** The database files are stored in `backend/data/` and are ignored by Git. When you clone this repo, you will start with a fresh, empty database.

Integration: Google Places API (Photos & Reviews).

✨ Key Features
City & Service Discovery: Browse supported cities and filter venues by category (Hotels, Restaurants, Clinics).

Social Community Hub: A dedicated social media feed where users can create posts, share travel experiences, and interact with updates from businesses and other travelers.

Hybrid Data Layer: Seamlessly merges static database records with live data (photos/ratings) from Google.

User System: Secure authentication allowing users to write their own custom reviews and rate locations.

Fluid UI: High-performance, physics-based animations for a premium user experience.
