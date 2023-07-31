# Address API Spec

## Create Address API
Endpoint : POST /api/contacts/:contactId/addresses

Header :
- Authorization : token

Request Body :
```json
{
    "street"      : "Sawojajar",
    "city"        : "Malang",
    "province"    : "Jawa Timur",
    "country"     : "Indonesia",
    "postal_code" : "Kode pos"
}
```

Response Body Success : 
```json
{
    "code"    : "200",
    "status"  : "Success",
    "request" : "POST",
    "data"    : {
        "id"          : 1,
        "street"      : "Sawojajar",
        "city"        : "Malang",
        "province"    : "Jawa Timur",
        "country"     : "Indonesia",
        "postal_code" : "Kode pos"
    }
}
```

Response Body Error : 
```json 
{
    "code"    : "400",
    "status"  : "Error",
    "message" : "Street is not valid format"
}
```
## Update Address API
Endpoint : PUT /api/contacts/:contactId/addresses/:addressId

Header :
- Authorization : token

Request Body :
```json
{
    "street"      : "Sawojajar",
    "city"        : "Malang",
    "province"    : "Jawa Timur",
    "country"     : "Indonesia",
    "postal_code" : "Kode pos"
}
```

Response Body Success : 
```json
{
    "code"    : "200",
    "status"  : "Success",
    "request" : "PUT",
    "data"    : {
        "id"          : 1,
        "street"      : "Sawojajar",
        "city"        : "Malang",
        "province"    : "Jawa Timur",
        "country"     : "Indonesia",
        "postal_code" : "Kode pos"
    }
}
```

Response Body Error : 
```json 
{
    "code"    : "400",
    "status"  : "Error",
    "message" : "Street is required"
}
```

## GET Address API
Endpoint : GET /api/contacts/:contactId/addresses/:addressId

Header :
- Authorization : token

Response Body Success : 
```json
{
    "code"    : "200",
    "status"  : "Success",
    "request" : "GET",
    "data"    : {
        "id"          : 1,
        "street"      : "Sawojajar",
        "city"        : "Malang",
        "province"    : "Jawa Timur",
        "country"     : "Indonesia",
        "postal_code" : "Kode pos"
    }
}
```

Response Body Error : 
```json 
{
    "code"    : "404",
    "status"  : "Error",
    "message" : "Contact is not found"
}
```

## List Address API
Endpoint : GET /api/contacts/:contactId/addresses

Header :
- Authorization : token

Response Body Success : 
```json 
{
    "code"    : "200",
    "status"  : "Success",
    "request" : "GET",
    "data"    : [
        {
            "id"          : 1,
            "street"      : "Sawojajar",
            "city"        : "Malang",
            "province"    : "Jawa Timur",
            "country"     : "Indonesia",
            "postal_code" : "Kode pos"
        },
        {
            "id"          : 2,
            "street"      : "Bondowoso",
            "city"        : "Solo",
            "province"    : "Jawa Timur",
            "country"     : "Indonesia",
            "postal_code" : "Kode pos"
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
    "code"    : "404",
    "status"  : "Error",
    "message" : "Contact is not found"
}
```

## Remove Address API
Endpoint : DELETE /api/contacts/:contactId/addresses/:addressId

Header :
- Authorization : token

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