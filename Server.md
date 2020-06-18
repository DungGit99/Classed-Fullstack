# Classsed

## Server
- [https://code.tutsplus.com/vi/articles/an-introduction-to-mongoose-for-mongodb-and-nodejs--cms-29527]
- **Install**
    - npm init -y
    - npm install apollo-server graphql mongoose
    - npm install bcryptjs
    - npm install jsonwebtoken

- **config.js**

    ```javascript
        module.exports = {
            MONGDB: 'mongodb+srv://classsed:<password>@cluster0-uxug2.mongodb.net/test?retryWrites=true&w=majority'
        }
    ```

- **models**
    - **User.js**

    ```javascript
        const { model,Schema } = require('mongoose')

        const userSchema = new Schema({
            username: String,
            password: String,
            email: String,
            createAt: String
        });

        module.exports = model('User',userSchema);
    ```
    - **Post.js**

    ```javascript
        const { model,Schema } = require('mongoose')

        const postSchema = new Schema({
            body: String,
            username: String,
            createAt: String,
            comments: [
                {
                    body: String,
                    username: String,
                    createAt: String
                }
            ],
            likes: [
                {
                    username: String,
                    createAt: String
                }
            ],
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        });

        module.exports = model('Post',postSchema);
    ```

-