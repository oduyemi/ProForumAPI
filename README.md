# ProForumAPI Documentation

ProForumAPI is an API designed to provide forum functionality for the ProGrowing mentorship platform. It allows users to create posts, comment on posts, like and dislike posts and comments, and interact with tags.

## Stack

- TypeScript
- Node.js
- Express
- Nodemon
- MongoDB

## Installation

1. Clone the repository from GitHub:

   ```bash
   git clone <https://github.com/oduyemi/ProForumAPI>
   ```

2. Navigate to the project directory:

   ```bash
   cd ProForumAPI
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Define the following environment variables in the `.env` file:

     ```plaintext
     PORT=3000
     MONGODB_URI=<the-mongodb-uri>
     SESSION_SECRET=<my-session-secret>
     ```

5. Start the development server:

   ```bash
   npm run dev
   ```

## Endpoints

### Users

- `GET /users`: Retrieve all users.
- `GET /users/:userId`: Retrieve a specific user by ID.
- `DELETE /users/:userId/delete`: Delete a user by ID.

### Admins

- `GET /admin`: Retrieve all admins.
- `GET /admin/:adminId`: Retrieve a specific admin by ID.
- `DELETE /admin/:adminId/delete`: Delete an admin by ID.

### Posts

- `GET /posts`: Retrieve all posts.
- `GET /posts/:postId`: Retrieve a specific post by ID.
- `POST /post`: Create a new post.
- `PUT /posts/:postId`: Update an existing post.
- `DELETE /posts/:postId/delete`: Delete a post by ID.
- `GET /posts/likes`: Retrieve all posts with likes.
- `GET /posts/dislikes`: Retrieve all posts with dislikes.
- `GET /posts/:postId/likes`: Retrieve likes for a specific post.
- `GET /posts/:postId/dislikes`: Retrieve dislikes for a specific post.

### Comments

- `GET /comments`: Retrieve all comments.
- `GET /comments/:commentId`: Retrieve a specific comment by ID.
- `POST /comment`: Create a new comment.
- `PUT /comments/:commentId`: Update an existing comment.
- `DELETE /comments/:commentId/delete`: Delete a comment by ID.
- `GET /comments/:commentId/likes`: Retrieve likes for a specific comment.
- `GET /comments/:commentId/dislikes`: Retrieve dislikes for a specific comment.

### Tags

- `GET /tags`: Retrieve all tags.
- `GET /tags/:tagId`: Retrieve a specific tag by ID.
- `POST /tag`: Create a new tag.
- `PUT /tags/:tagId`: Update an existing tag.
- `DELETE /tags/:tagId/delete`: Delete a tag by ID.

### Likes and Dislikes

- `POST /post/like`: Like a post.
- `POST /post/dislike`: Dislike a post.
- `POST /comment/like`: Like a comment.
- `POST /comment/dislike`: Dislike a comment.

## Middlewares

- `authenticateUser`: Middleware to verify user authentication.
- `checkAlreadyLikedOrDisliked`: Middleware to check if the user has already liked or disliked a post/comment.

## Models

The API uses the following models:

- `User`: Represents a user of the platform.
- `Admin`: Represents an admin user of the platform.
- `Post`: Represents a forum post.
- `Comment`: Represents a comment on a post.
- `Tag`: Represents a tag associated with posts or comments.
- `Like`: Represents a like on a post.
- `Dislike`: Represents a dislike on a post.
- `CommentLike`: Represents a like on a comment.
- `CommentDislike`: Represents a dislike on a comment.

## Error Handling

The API handles errors gracefully and returns appropriate HTTP status codes along with error messages when an error occurs.

## Security

- User authentication is required for certain endpoints to perform actions like creating posts, comments, and liking/disliking.
- Sessions are managed securely using a session secret.

## Contributing

Contributions to the ProForumAPI project are welcome. To contribute, please follow the standard GitHub workflow:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

## License

This project is licensed under the MIT License. See the [LICENSE](link-to-license-file) file for details.

## Contact

For any inquiries or support, please contact [hello@yemi.dev](mailto:hello@yemi.dev).

---
