# FormulaPro

FormulaPro is an interactive web application for learning geometry and calculating the properties of 2D and 3D geometric figures. It combines mathematical calculations, visual representations, and interactive learning tools in a modern, responsive interface.

The application is designed to make geometry easier to understand by presenting mathematical formulas together with visual diagrams and 3D models.

## Features

### 2D Geometry Calculators

- Circle — calculate the area, circumference, radius, diameter, and sector properties.
- Triangle — calculate area, perimeter, angles, and other geometric properties. Visualize medians, altitudes, angle bisectors, the incircle, and the circumcircle.
- Parallelogram — calculate area, perimeter, base, side length, and height.

### 3D Geometry Calculators

- Sphere — calculate volume, surface area, and radius.
- Cone — calculate volume, surface area, radius, and height.
- Rectangular Prism — calculate volume, surface area, length, width, and height.

### Interactive Learning

- Geometry knowledge quiz.
- Visual representations of geometric figures.
- Dynamic diagrams that respond to user input.
- Animated 3D models.
- Calculation history.

### User Interface

- Responsive design for desktop and mobile devices.
- Russian and English language support.
- Light, dark, and pastel themes.
- Modern interface built with reusable React components.

## Graphics and Visualization

FormulaPro uses several browser-based graphics technologies. Different rendering methods are selected

 depending on the type of geometric figure and visualization requirements.

### 2D Graphics

HTML Canvas API

Canvas API is used to draw the circle visualization.

The implementation uses:

- `HTMLCanvasElement`
- `CanvasRenderingContext2D`
- `getContext("2d")`
- `arc()`, `lineTo()`, `fill()`, and `stroke()`
- `ResizeObserver` for responsive resizing.

The circle and its sector, radius line, center point, and labels are drawn programmatically using TypeScript.

SVG (Scalable Vector Graphics)

SVG is used to render the triangle and parallelogram diagrams.

The implementation uses SVG elements such as:

- `<svg>`
- `<polygon>`
- `<line>`
- `<circle>`
- `<path>`
- `<polyline>`
- `<text>`
- `<g>`

SVG provides scalable vector diagrams, allowing geometric elements, labels, and construction lines to remain sharp at different screen sizes.

### 3D Graphics

Three.js

Three.js is used to create and render interactive 3D geometric models.

The following figures use Three.js:

- Sphere — `THREE.SphereGeometry`
- Cone — `THREE.ConeGeometry`
- Rectangular Prism — `THREE.BoxGeometry`

The 3D visualizations include:

- Perspective cameras.
- Lighting and materials.
- Transparent surfaces.
- Wireframe and edge geometry.
- Dimension lines and labels.
- Animated model rotation.
- Responsive renderer resizing.
- Resource cleanup and disposal.

WebGL

Three.js uses WebGL through `THREE.WebGLRenderer` to render 3D graphics in the browser.

This provides hardware-accelerated rendering and enables interactive 3D visualizations.

Canvas Textures

The 3D models also use the HTML Canvas API to generate textures for labels. These are converted into Three.js textures using `THREE.CanvasTexture` and displayed as sprites.

### Visualization Technology Overview

| Figure | Rendering technology |

| Circle | HTML Canvas API |

| Triangle | SVG |

| Parallelogram | SVG |

| Sphere | Three.js + WebGL |

| Cone | Three.js + WebGL |

| Rectangular Prism | Three.js + WebGL |

## Technology Stack

### Frontend

| Technology | Purpose |

| React | User interface and component architecture |

| TypeScript | Application logic and type safety |

| Vite | Development server and build tooling |

| React Router | Client-side routing |

| SCSS | Styling and responsive layouts |

| HTML5 Canvas API | 2D graphics rendering |

| SVG | Vector-based geometry diagrams |

| Three.js | 3D model creation and rendering |

| WebGL | Hardware-accelerated 3D graphics |

### Backend

| Technology | Purpose |

| Node.js | JavaScript runtime |

| Express 5 | Backend API framework |

| TypeScript | Backend application logic |

| Prisma ORM | Database access and schema management |

| PostgreSQL | Relational database |

| `@prisma/adapter-pg` | PostgreSQL driver adapter |

| `pg` | PostgreSQL client |

| Helmet | HTTP security headers |

| CORS | Cross-origin resource sharing |

| cookie-parser | Cookie parsing and session handling |

FormulaPro is organized into two main applications: a frontend client and a backend API.

## Getting Started

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone <repository-url>
cd FormulaPro
```

### 2. Set up the backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/formulapro?schema=public"
```

Replace `USER` and `PASSWORD` with your PostgreSQL credentials and make sure the database exists.

Apply database migrations:

```bash
npx prisma migrate deploy
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Start the backend using the development script defined in `backend/package.json`:

```bash
npm run dev
```

### 3. Set up the frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend using the development script defined in `frontend/package.json`:

```bash
npm run dev
```

The frontend will be available at the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## Backend API

The backend exposes REST API endpoints for health checks and calculation history.

### Health Check

| Method | Endpoint | Description |

||

| GET | `/api/health` | Check backend availability |

### Calculation History

| Method | Endpoint | Description |

||

| GET | `/api/history` | Retrieve calculation history |

| POST | `/api/history` | Save a calculation |

| DELETE | `/api/history` | Delete calculation history |

| DELETE | `/api/history/:id` | Delete a specific calculation |

The history API uses guest sessions to associate calculations with a browser session.

## Database

FormulaPro uses PostgreSQL as its relational database and Prisma ORM for database access.

### Main Models

GuestSession

Represents a guest browser session used to associate calculations with a visitor without requiring account registration.

Calculation

Stores calculation records, including the calculator type and calculation data, associated with a guest session.

### Supported Calculator Types

- `CIRCLE`
- `TRIANGLE`
- `SPHERE`
- `CONE`
- `PARALLELOGRAM`
- `PRISM`
- `QUIZ`

### Guest Session Management

The application supports guest access without mandatory registration.

A guest session is identified through an HTTP-only cookie named `fp_guest`.

The backend uses a hashed session identifier to associate calculation records with the corresponding guest session.

The history API returns the latest 100 records for the current guest session.

## Environment Variables

### Backend

| Variable | Description |

||

| `PORT` | Backend server port |

| `FRONTEND_URL` | Allowed frontend origin for CORS |

| `DATABASE_URL` | PostgreSQL connection string |

### Frontend

| Variable | Description |

||

| `VITE_API_URL` | Backend API base URL |

Do not commit environment files containing database credentials or other secrets to version control.

## Security Considerations

FormulaPro includes several backend security measures:

- Helmet for HTTP security headers.
- CORS configuration to restrict allowed frontend origins.
- HTTP-only guest session cookies.
- Secure cookie settings in production.
- Hashed guest session identifiers in the database.
- Server-side validation of calculation data.
- An allowlist of supported calculator types.
- Guest-session ownership checks when deleting history records.

## Internationalization and Themes

The application supports two languages:

- English
- Russian

Users can also switch between three interface themes:

- Light
- Dark
- Pastel

These features help provide a consistent and accessible user experience.

## Development Notes

- The frontend and backend are maintained as separate npm applications.
- The frontend communicates with the backend through REST API requests.
- Calculation history is stored in PostgreSQL.
- Prisma migrations are used to manage database schema changes.
- 2D and 3D visualizations are implemented using different rendering technologies according to their requirements.
- Three.js is used for interactive 3D models, while Canvas API and SVG are used for 2D diagrams.

## License

No license has been specified for this project yet.
