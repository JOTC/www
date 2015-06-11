// "test-password-1"
// $2a$10$YZR8NMyyDzFY5ixvNerUneTr/2qGkxVgi.uzGBQxhv9koEj//6zrK
//
// "test-password-2"
// $2a$10$X/zlr3SzwNgTnKLs/YztQeZxbxTJwy0GZelyJPrrjbFIzyRFvm9Z2

db.users.insert({ name: "Test User 1", email: "", local: { username: "test1", password: "$2a$10$YZR8NMyyDzFY5ixvNerUneTr/2qGkxVgi.uzGBQxhv9koEj//6zrK" }, permissions: { "links": false, "officers": false, "shows": false, "classes": false, "pictures": false, "calendar": false, "users": false }});
db.users.insert({ name: "Test User 2", email: "", local: { username: "test2", password: "$2a$10$X/zlr3SzwNgTnKLs/YztQeZxbxTJwy0GZelyJPrrjbFIzyRFvm9Z2" }, permissions: { "links": true, "officers": true, "shows": true, "classes": true, "pictures": true, "calendar": true, "users": true }});
