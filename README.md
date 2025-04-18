# FEUP-BDNR
FEUP - Bases de Dados Não Relacionais

**NoSQL databases** labs (PostgreSQL, Redis, MongoDB, Cassandra and Neo4j) and project.

### Project: 

Developed a web application where users can search for movies, actors, and directors, view detailed information, and interact with the content by leaving comments and ratings. Users can express their preferences by liking or disliking movies and features a recommendation mechanism based on user preferences. Suggests movies with similar descriptions or common actors using graph queries and search analyzers. 

Additionally, it features a social aspect, users can create profiles, search for other users, follow and unfollow people, and view timelines that display the latest reactions and comments from the people they follow. Each user can see their followers and who they are following, and the system supports personalized suggestions such as recommending users nearby or suggesting movies based on what followed users liked or reacted to.

The backend is built with Node.js, and the frontend uses React. Data is stored in ArangoDB, a **NoSQL graph database**, which enables efficient handling of relationships between entities like movies, actors, genres, users, and comments.

---

- cd proj
- make run

Em um terminal:

- cd backend
- npm install
- npm start

Em outro terminal

- cd frontend
- npm install
- npm start


