# Contact API Spec

## Create Contact API
Endpoint : POST /api/contacts
Headers :
- Authorization : token

Request Body :
```json 
{
    "first_name" : "Devano",
    "last_name" : "Alif",
    "email" : "devano@gmail.com",
    "phone" : "12345"
}
```
Response Body Success :
```json 
{
    "code"    : "200",
    "status"  : "Success",
    "request" : "POST",
    "data"    : {
        "id"         : 1,
        "first_name" : "Devano",
        "last_name"  : "Alif",
        "email"      : "devano@gmail.com",
        "phone"      : "12345"
    }
}
```

Response Body Error :
```json 
{
    "code"    : "400",
    "status"  : "Error",
    "message" : "Email is not valid format"
}
```


## Update Contact API
<!-- pakai put karena sistemnya menimpa -->
Endpoint : PUT /api/contacts/:id

Headers :
- Authorization : token

Request Body :
Request Body :
```json 
{
    "first_name" : "Devano",
    "last_name" : "Alif",
    "email" : "devano@gmail.com",
    "phone" : "12345"
}
```
Response Body Success :
```json 
{
    "code"    : "200",
    "status"  : "Success",
    "request" : "PUT",
    "data"    : {
        "id"         : 1,
        "first_name" : "Devano",
        "last_name"  : "Alif",
        "email"      : "devano@gmail.com",
        "phone"      : "12345"
    }
}
```

Response Body Error :
```json 
{
    "code"    : "400",
    "status"  : "Error",
    "message" : "Email is not valid format"
}
```

## Get Contact API
Endpoint : GET /api/contacts/:contactId
Headers :
- Authorization : token

Response Body Success :
```json 
{
    "code"    : "200",
    "status"  : "Success",
    "request" : "GET",
    "data" : {
        "id"         : 1,
        "first_name" : "Devano",
        "last_name"  : "Alif",
        "email"      : "devano@gmail.com",
        "phone"      : "12345"
    }
}
```

Response Body Error :
```json 
{
    "code"    : "404",
    "status"  : "Error",
    "message" : "Contacts is not found"
}
```

## Search Contact API
Endpoint : GET /api/contacts

Headers :
- Authorization : token

Query params :
- name : Search by first_name or last_name, using like, optional
- email : Search by email, using like, optional
- phone : Search by phone, using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :
```json 
{
    "code"    : "200",
    "status"  : "Success",
    "data"    : [
        {
            "id"         : 1,
            "first_name" : "Devano",
            "last_name"  : "Alif",
            "email"      : "devano@gmail.com",
            "phone"      : "12345"
        },
        {
            "id"         : 2,
            "first_name" : "Davano",
            "last_name"  : "Alif",
            "email"      : "devano@gmail.com",
            "phone"      : "54321"
        }
    ],
    "paging" : {
        "page"       : 1,
        "total_page" : 3,
        "total_item" : 30
    }
}
```

Response Body Error :
```json 
{
    "code"       : "404",
    "status"     : "Error",
    "message"    : "Contact is not found"
}
```
## Remove Contact API
Endpoint : DELETE /api/contacts/:contactId
Headers :
- Authorization : token

Request Body : 
```json 
{
    "id" : 1
}
```
Response Body Success :
```json 
{
    "code"    : "200",
    "status"  : "Success",
    "request" : "Delete",
    "data"    : "OK"
}
```
Response Body Error :
```json 
{
    "code"       : "404",
    "status"     : "Error",
    "message"    : "Contact is not found"
}
```