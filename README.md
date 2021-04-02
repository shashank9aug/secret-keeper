# Secret-keeper
It will store your secret private and encrypted once you login as user you can store your secret over here.

## Project Structure
---
```shell
public            # all styling and scripting files   
├── css      
└── js

views             # all frontend  files.(hbs) 
├── partials      # header and footer.
├── login            
├── register
├── home         
├── secrets
└── submit  
```

## Tech / Framework used
---
 - Frontend (Hbs , CSS , Javascript, Bootstrap)
 - Backend (NodeJs , ExpressJs)
 - Database (MongoDB , Mongoose)
 - Authentication
 - cookies and sessions
## About:
### Authentication and Encryption
  - Level-01 : We simply store user details in database and authenticate while user try to login.
  problem arises if anybody have database access can get user details easily.

  - Level-02 (encrypt) : we use encryption    technique as Caesar-Ciphar and an npm package mongoose-encryption.problem arises if anybody have db access and encryption key access can get user details easily as user details stored as binary.

  - Level-03 (Hashing) : we use hashing to hash the password when user signup and hash the password when user try login. for this we use npm package 'md5' as it will generate hash.problem arises as hash value not change for fixed string.we may face dictionary attack by hacker's.

  - Level-04 (Hashing and Salting) : when user signup user details will go through hash function with salting(by random set of string) to generate hash.for this we should use npm package becrypt.this method of encryption is far more secure than level 3.

 - Level-05 (Cookies and Sessions)            
  
 - Level-06 (OAuth 2.0) :    

      
