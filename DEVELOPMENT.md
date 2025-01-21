# BrainWave Trivia  
**Development Plan**  

---

## **Project Overview**  
BrainWave Trivia is an **AI-powered trivia game platform** that generates custom questions based on user-selected topics. The application uses advanced AI agents to create engaging, educational content while providing various game modes for users to enjoy. The platform supports:  
- **Single-player and multiplayer modes**  
- **Custom trivia generation from documents**  
- **Unique Snake and Ladders trivia game**  

---

## **Current Features**  

### **Core Functionality**  
- AI-powered trivia generation using OpenRouter API (Gemini model)  
- Multiple question types (multiple-choice, true/false, text input)  
- Difficulty levels (easy, medium, hard)  
- Custom topic selection  
- Classic trivia mode with predefined questions  
- Basic game scoring system  
- Timer-based gameplay  

### **Technical Implementation**  
- **Frontend**: Next.js with TypeScript, Tailwind CSS, PWA support, Dark/Light theme  
- **Backend**: FastAPI, Pydantic, SQLAlchemy, Phidata (AI agents)  
- **Database**: PostgreSQL (structured data), LanceDB (vector storage)  
- **Caching**: Redis  

---

## **Development Roadmap**  

### **Phase 1: Database Integration (2 Weeks)**  
- [ ] **Week 1**:  
  - Set up PostgreSQL database.  
  - Create user authentication schema.  
  - Implement basic CRUD operations for users.  
  - **Files**: `database/migrations/`, `database/models/`  
- [ ] **Week 2**:  
  - Create game history tracking schema.  
  - Implement game history storage and retrieval.  
  - Create leaderboards schema and basic functionality.  
  - **Files**: `database/models/`, `app/models/`  

### **Phase 2: Efficient Data Retrieval (2 Weeks)**  
- [ ] **Week 1**:  
  - Design schemas for PostgreSQL and LanceDB.  
  - Implement seamless integration between LanceDB and PostgreSQL.  
  - Set up SQLAlchemy ORM for PostgreSQL.  
  - **Files**: `app/models/`, `ai/storage/vector_store.py`  
- [ ] **Week 2**:  
  - Optimize question caching and retrieval performance.  
  - Ensure efficient data handling and retrieval.  
  - Define models using SQLAlchemy for users, games, questions, game history, and leaderboards.  
  - **Files**: `app/models/`, `app/database/`  

### **Phase 3: AI Enhancement (2 Weeks)**  
- [ ] **Week 1**:  
  - Implement document upload system.  
  - Create custom knowledge base using RAG agents.  
  - **Files**: `ai/agents/rag_agent.py`, `ai/services/document_processor.py`  
- [ ] **Week 2**:  
  - Enhance question generation with RAG agents.  
  - Implement fact-checking integration.  
  - Refine categories and calibrate difficulty levels.  
  - **Files**: `ai/services/question_generator.py`  

### **Phase 4: Frontend Enhancements (Ongoing)**  
- [ ] **Weeks 1-2**:  
  - Implement user access control in the frontend.  
  - Display user game history.  
  - Integrate RAG trivia game into the frontend.  
  - **Files**: `components/`, `pages/`  
- [ ] **Weeks 3-4**:  
  - Implement UI/UX improvements (animated transitions, statistics dashboard).  
  - Develop social features (game sharing, leaderboards, friend system, challenge system).  
  - **Files**: `components/`, `pages/`  

### **Phase 5: Multiplayer Features (3 Weeks)**  
- [ ] **Week 1**:  
  - Implement Snakes & Ladders game board.  
  - Integrate questions into the Snakes & Ladders game.  
  - **Files**: `components/SnakesAndLadders.tsx`, `app/api/multiplayer/`  
- [ ] **Week 2**:  
  - Implement movement mechanics for Snakes & Ladders.  
  - Develop multiplayer support for Snakes & Ladders.  
  - **Files**: `components/SnakesAndLadders.tsx`, `app/api/multiplayer/`  
- [ ] **Week 3**:  
  - Implement real-time game sessions using WebSockets.  
  - Develop lobby system for multiplayer games.  
  - Implement invitation mechanism for multiplayer games.  
  - **Files**: `app/api/multiplayer/`, `components/`  

### **Phase 6: Performance & Infrastructure (2 Weeks)**  
- [] **Week 1**:  
  - Implement Redis caching layer.  
  - Cache questions and answers for efficient retrieval.  
  - Manage user sessions using Redis.  
  - **Files**: `app/services/caching.py`  
- [ ] **Week 2**:  
  - Containerize the application using Docker.  
  - Set up CI/CD pipeline for automated testing and deployment.  
  - Implement monitoring using Prometheus and Grafana.  
  - Set up load balancing for scalability.  
  - **Files**: `Dockerfile`, `.github/workflows/`, `monitoring/`  

---

## **Technical Architecture**  

### **Backend Structure**  
- **Framework**: FastAPI  
- **ORM**: SQLAlchemy (PostgreSQL)  
- **AI Agents**: Phidata  
- **Vector Storage**: LanceDB  
- **Caching**: Redis  

### **Frontend Structure**  
- **Framework**: Next.js with TypeScript  
- **Styling**: Tailwind CSS  
- **PWA Support**: Manifest configuration  
- **Theming**: Dark/Light mode  

---

## **Database Schema**  

### **PostgreSQL**  
- **Users**: `id`, `username`, `email`, `password_hash`, `created_at`, `updated_at`  
- **Games**: `id`, `user_id`, `topic`, `difficulty`, `num_questions`, `created_at`, `updated_at`  
- **Questions**: `id`, `game_id`, `question_text`, `answer`, `question_type`, `difficulty`, `created_at`, `updated_at`  
- **GameHistory**: `id`, `user_id`, `game_id`, `score`, `duration`, `played_at`  
- **Leaderboards**: `id`, `user_id`, `score`, `created_at`  

### **LanceDB**  
- **QuestionsVectorStore**: `question_id`, `question_text`, `answer`, `embedding`  

---

## **ERD Representation**  

```plaintext
Users  
├── Games  
│   └── Questions  
├── GameHistory  
└── Leaderboards  

LanceDB  
└── QuestionsVectorStore  
    └── Questions (vectorized)  
```

---

## **Progress Tracking**  

### **Completed**  
- [&check;] Sample frontend for testing backend-generated questions  
- [&check;] Basic AI-powered trivia generation using OpenRouter API  
- [&check;] Multiple question types and difficulty levels  
- [&check;] Custom topic selection  
- [&check;] Classic trivia mode with predefined questions  
- [&check;] Basic game scoring system and timer-based gameplay  
- [&check;] Next.js frontend with TypeScript  
- [&check;] FastAPI backend setup  
- [&check;] AI Agent architecture using Phidata  
- [&check;] PWA support with manifest configuration  
- [&check;] Dark/Light theme support using Tailwind CSS  

### **In Progress**  
- [ ] PostgreSQL setup and user authentication schema  
- [ ] OAuth (Google/GitHub) integration with Next.js
- [ ] LanceDB vector store enhancement  
- [ ] Connection between PostgreSQL and LanceDB  
- [ ] SQLAlchemy ORM integration  
- [ ] RAG implementation for document-based trivia generation  
- [ ] Frontend user access control and game history display  
- [ ] UI/UX improvements and social features  

### **Upcoming**  
- [ ] Game history tracking and leaderboards  
- [ ] Similarity search and retrieval performance optimization  
- [ ] Fact-checking integration and question quality improvements  
- [ ] Snakes & Ladders game board implementation  
- [ ] Real-time game sessions and multiplayer support  
- [ ] Redis caching layer implementation  
- [ ] Docker containerization and CI/CD pipeline setup  
- [ ] Monitoring and load balancing implementation  
---

## **Folder Structure**  

### **Backend**  
```plaintext
app/  
├── api/  
│   ├── auth/  
│   ├── games/  
│   ├── questions/  
│   ├── users/  
│   └── multiplayer/  
├── models/  
│   ├── user.py  
│   ├── game.py  
│   ├── question.py  
│   ├── game_history.py  
│   └── leaderboard.py  
├── storage/  
│   └── vector_store.py  
├── services/  
│   ├── document_processor.py  
│   ├── question_generator.py  
│   ├── auth_service.py  
│   └── caching.py  
└── database/  
    ├── __init__.py  
    ├── models.py  
    └── session.py  
database/  
├── migrations/  
└── models/  
tests/  
├── unit/  
└── integration/  
```

### **Frontend**  
```plaintext
components/  
├── GameCard.tsx  
├── SnakesAndLadders.tsx  
├── Leaderboard.tsx  
└── GameHistory.tsx  
pages/  
├── index.tsx  
├── auth/  
│   ├── login.tsx  
│   └── signup.tsx  
└── games/  
    ├── create.tsx  
    ├── play.tsx  
    └── history.tsx  
lib/  
├── auth/  
└── api/  
public/  
├── manifest.json  
└── icons/  
```

---

## **Development Tools**  

### **Backend**  
- **FastAPI**: RESTful API framework  
- **Pydantic**: Data validation and settings management  
- **SQLAlchemy**: ORM for PostgreSQL  
- **Phidata**: AI agent management  
- **LanceDB**: Vector data storage  
- **Redis**: Caching layer  

### **Frontend**  
- **Next.js**: React framework with TypeScript  
- **Tailwind CSS**: Styling and responsive design  
- **PWA Support**: Manifest and service workers  

### **Deployment**  
- **Docker**: Containerization  
- **CI/CD**: GitHub Actions  
- **Monitoring**: Prometheus and Grafana  

---

## **Security**  
- **HTTPS**: Secure data transmission  
- **OAuth**: Secure user authentication  
- **JWT**: Session management  
- **Regular Updates**: Patch security vulnerabilities  

---
<br>

## **Testing**  
- **Unit Tests**: pytest for backend logic  
- **Integration Tests**: Full application testing  
- **Load Testing**: Ensure performance and reliability
