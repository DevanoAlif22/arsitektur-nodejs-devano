<!-- user api -->
# User API Spec

## Register User
Endpoint : POST /api/users
```json
{
    "username" : "Devanoalif",
    "password" : "rahasia",
    "name"     : "Devano"
}
```
Response Body Success : 
```json
{
    "code"    : "200",
    "status"  : "Success",
    "request" : "POST",
    "data"    : {
        "username" : "Devanoalif",
        "name"     : "Devano"
    },

}
```
Response Body Error : 
```json
{
    "code"     : "409",
    "status"   : "Error",
    "message"  : "Username already registered"
}
```

## Login User
Endpoint : POST /api/users/login

Request Body : 
```json
{
    "username" : "Devanoalif",
    "password" : "rahasia"
}
```
Response Body Success : 
```json
{
    "code"    : "200",
    "status"  : "Success",
    "request" : "POST",
    "data"    : {
        "token" : "Unique-token"
    },

}
```
Response Body Error : 
```json
{
    "code"    : "401",
    "status"  : "Error",
    "message" : "username or password wrong"

}
```

## Update User
<!-- kalau data parsial yang bisa di update mending PATCH -->
<!-- jika PUT itu istilahnya di timpa -->
<!-- hanya bisa update password dan name -->
<!-- karena yang di update adlah user yang sedang login maka current -->
Enpoint : PATCH /api/users/current

<!-- ketika update user harus sudah login, setelah login dia dapet token -->
<!-- jika update dia harus update data dia, jadi harus login -->
<!-- harus ada header yang berisi token login -->

Headers :
- Authorization : token

Request Body : 
```json
{
    "name" : "Davano", // optional
    "password" : "rahasia" // optional
}
```

Response Body Success : 
```json
{
    "code"    : "200",
    "status"  : "Success",
    "request" : "PATCH",
    "data" : {
        "username" : "devano",
        "name" : "davano"
    },
}
```

Response Body Error : 
```json
{
    "code"    : "400",
    "status"  : "Error",
    "message" : "name length max 100"
}
```
## Get User
Endpoint : GET /api/users/current

Headers :
- Authorization : token

Response Body Success : 
```json
{
    "code"    : "200",
    "status"  : "Success",
    "request" : "GET",
    "data"    : {
        "username" : "Devanoalif",
        "name" : "Devano"
    },
}
```

Response Body Error : 
```json
{
    "code"   : "401",
    "status" : "Error",
    "message" : "Unauthorized"
}
```

## Logout User
Endpoint : DELETE /api/users/logout

Headers :
- Authorization : token

Response Body Success : 
```json
{
    "code"    : "200",
    "status"  : "Success",
    "request" : "DELETE",
    "data"    : "OK"
}
```

Response Body Error : 
```json
{
    "code"    : "401",
    "status"  : "Error",
    "message" : "Unauthorized"
}
```