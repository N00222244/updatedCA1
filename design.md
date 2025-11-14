
# Project Overview

This project sets out to build a rest api server for the backend of luxury auto webstie that displays dealerships and their assocaited brands sold. This project will use node.js and express to make up the backend of the system. Users will be able to view cars, dealerships and brands. It also has features for managers of car dealerships to publish and modify 
their dealerships.

# Database Design Choices

There are four models within my project. The user model, car model, brand model, dealership model. 

## The relationships between these models are as follows:
 - 1 user(role == manager || admin) can have many dealerships.
 - 1 dealership can have many brands.
 - 1 brand can be sold at many dealerships
 - 1 brand can have many cars.

### User Model Fields:

- name:
    Type: String
    required: true
    minLength: 2
- email:
    Type: String
    required: true
    minLength: 4
- passwordHash:
    Type: String
    required: true
    minLength: 5
- phone:
    Type: String
    required: false
    minLength: 6



### Car Model Fields:
- modelName:
    Type: String
    required: True
    minLength: 5
- year:
    Type: Number
    required: True
    minValue: 1900
    maxValue: 2025
- price:
    Type: Number
    required: True
- engineSize:
    Type: Number
    required: True
    minValue: 0.5
    maxValue: 10
- mileage:
    Type: Number
    required: True
- description:
    Type: String
    required: false
- extras:
    Type: Array of Strings
    required: false
- brand_id:
    Type: object id  (references brand)
    required: True

### Brand model Fields
- brandName:
    Type: String
    minLength: 2
    Required: True
- yearEstablished:
    Type: Number
    minValue: 1810
    maxValue: 2025
    Required: True
- logUrl:
    Type: String
    Required: True
- website:
    Type: String
    Required: True
- country:
    Type: String
    Required: True
- description:
    Type: String
    Required: false

### Dealership model Fields
- dealershipName:
    Type: String
    minLength: 5
    Required: True
- location:
    Type: String
    Required: True
- phone:
    Type: String
    Required: True
- brands:
    Type: array of object Ids (references brands)
    Required: false
- manager
    Type: object Id(references manager who created dealership)
    required: True

## Api Design


Since this website is designed to be a directory for luxurious car dealershsips I felt that the only a user should be required to sign up
this could potentially filter out any bots or other users who arent serious about enquiring. hence i made all routes apart from login/register require authentication. Within the site there are 3 user types, an ordinary user who can only get cars,brands and dealerships. Then there is a manager user who has the ability to create a dealershsip and select which brands are sold at his dealership. Finally there is the admin user who has full crud controll over all models within the site.

### Api Routes

#### Auth Routes
Get /api/register - register user
Get /api/login  - login user
Get /api/logout -logout user
Get /api/me -info about user

#### User Routes
Get /api/admin/users - gets list of all users

#### Car Routes

Get /api/car - retrieves all cars
Get /api/car/:id - retrieves car by id
Post /api/car - Creates car
Patch /api/car/:id - updates car by id
Delete /api/car/:id - deletes car by id


#### Brand Routes

Get /api/brand - retrieves all brands
Get /api/brand/:id - retrieves brand by id
Post /api/brand - Creates brand
Patch /api/brand/:id - updates brand by id
Delete /api/brand/:id - deletes brand by id

#### Dealership Routes

Get /api/dealership - retrieves all dealerships
Get /api/dealership/:id - retrieves dealership by id
Post /api/dealership - Creates dealership
Patch /api/dealership/:id - updates dealership by id
Delete /api/dealership/:id - deletes dealership by id

    
## Security Considerations

The security considerations inmplemented within this project include:
    - Strict validation of different modesl within the database
    - Error handling of different failed request
    - Strict session checking to make sure the user is authenticated
    - Strict Role checking to make sure the user is authorized to make requests.
    - Sanitization of user input with a validator class
    - Running pelethora of tests to ensure functionality works as expected.
    - Hashing of passwords using 10 salt rounds to ensure passwords are encrypted within the database


## Extra Mile Feature

Unfortunately I could not implement an extra mile feature, I tried to add a AWS S3 bucket to store photos of the image. I managed to creat a bucket 
but could not sucessfuly find a way to send the formdata within insomnia without triggering multiple validation errors.


## Future improvements

I think that in the future I would have liked to add a working S3 bucket that stores image, i also would like to add a location api
that provides the adress in map form to find these dealers or implement an auciton system that can simulate real time bidding from users to make it seem more
like a luxuriosu auto site.


