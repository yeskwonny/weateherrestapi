import { Router } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { v4 as uuid4 } from "uuid";
import * as Users from "../models/users.js";
import auth from "../middleware/auth.js";

const userController = Router();

//User Login
userController.post("/users/login", (req, res) => {
  /*
    #swagger.summary = 'User login'
    #swagger.requestBody = {
        description: 'Attempt user login with email and password',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string'
                        },
                        password: {
                            type: 'string'
                        },
                    }
                },
                example: {
                    email: 'user@server.com',
                    password: 'abc123',
                }
            }
        }
    } 
    #swagger.responses[200] = {
        description: 'Login successful',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                        authenticationKey: {
                            type: 'string'
                        },
                    }
                },
            }
        }
    } 
    #swagger.responses[400] = {
        description: 'Invalid credentials',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                    }
                },
            }
        }
    } 
    #swagger.responses[500] = {
        description: 'Database error',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                    }
                },
            }
        }
    } 
*/

  // access request body
  let loginData = req.body;

  //   TODO: Add validation
  //   if (!/^[a-zA-Z]+@[a-zA-Z].com$/.test(req.body.email)) {
  //     res.status(400).json({
  //       status: 400,
  //       message: "Invalid Email format",
  //     });
  //     return;
  //   }

  // Find user by email
  Users.getByEmail(loginData.email)
    .then((user) => {
      // Check passwords match
      if (bcrypt.compareSync(loginData.password, user.password)) {
        //update last login date
        // Generate new api key
        user.authenticationKey = uuid4().toString();
        user.lastLoginDate = new Date();

        // Update user record with new api key
        Users.update(user).then((result) => {
          res.status(200).json({
            status: 200,
            message: "user logged in",
            authenticationKey: user.authenticationKey,
            lastLoginDate: user.lastLoginDate,
          });
        });
      } else {
        res.status(400).json({
          status: 400,
          message: "invalid credentials",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: `Failed to Login /${error}`,
      });
    });
});

//User Logout
userController.post("/users/logout", (req, res) => {
  /*
   #swagger.summary = "User logout"
   #swagger.requestBody = {
        description: "Invalidate and clear current authentication key from the system",
        content: {
            'application/json': {
                schema: {
                    type: "object",
                    properties: {
                        authenticationKey: {
                            type: 'string'
                        },
                    }
                },
                example: {
                    authenticationKey: '5814b177-b041-48c6-b913-9ed2d4a785e4',
                }
            }
        }
    }   

    #swagger.responses[200]={
    description:"Logout succssful",
    content:{
        'application/json':{
            schema:{
                type:"object",
                properties:{
                    status:{
                        type:"number"
                    },
                    message :{
                        type:"string"
                    },
                    authenticationKey:{
                        type:"string"
                    }
                }
            }
        }
    }
}

    #swagger.responses[400]={
    description:"Fail to Logout",
    content:{
        'application/json':{
            schema:{
                type:"object",
                properties:{
                    status:{
                        type:"number"
                    },
                    message :{
                        type:"string"
                    } 
                }
            }
        }
    }
}

    #swagger.responses[500]={
        description:"Database error",
        content:{
        'application/json':{
            schema:{
                type:"object",
                properties:{
                    status:{
                        type:"number"
                    },
                    message :{
                        type:"string"
                    } 
                }
            }
        }
    }
}
*/
  const authenticationKey = req.body.authenticationKey;
  Users.getByAuthKey(authenticationKey)
    .then((user) => {
      user.authenticationKey = null;
      Users.update(user).then((user) => {
        res.status(200).json({
          status: 200,
          message: "user logged out",
        });
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: `failed to logout user / ${error}`,
      });
    });
});

// get user by user id
userController.options("/users/:id", cors());
userController.get("/users/:id", auth(["admin", "student"]), (req, res) => {
  /*
     #swagger.summary = 'Get user by ID'
     #swagger.parameters['id'] = {
            in: 'path',
            description: 'User ID',
            type: 'string'
        } 
 #swagger.responses[200] = {
            description: 'User found',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                            user: {
                                type: 'object',
                                properties: {
                                   _id: {
                                        type: 'string'
                                    },
                                    role: {
                                        type: 'string',
                                        enum: ['student','admin']
                                    },
                                    authenticationKey: {
                                        type: 'string'
                                    },
                                   password: {
                                        type: 'string'
                                    },
                                  
                                     email: {
                                        type: 'string'
                                    },
                                    registeredDate: {
                                        type: 'string'
                                    },
                                    
                                    lastlogindate: {
                                        type: 'string'
                                    },
                                }
                            }
                        }
                    },
                }
            }
        } 
    
        #swagger.responses[400] = {
            description: 'No user found',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                            
                        }
                    },
                }
            }
        } 


        #swagger.responses[500] = {
            description: 'Database error',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                           
                        }
                    },
                }
            }
        } 
    */

  const userId = req.params.id;
  const stringUserId = userId.toString();
  Users.getByID(userId)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Found user by userID",
        user: user,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: `Failed to get user by userID /${error}`,
      });
    });
});

// get user by authenticationkey
userController.get(
  "/users/auth/key/:authenticationkey",
  [auth(["admin"])],
  (req, res) => {
    /* 
        #swagger.summary = 'Get user by authentication key'
       #swagger.parameters['authenticationkey'] = {
            in: 'path',
            description: 'authenticationkey',
            type: 'string'
        } 
        #swagger.responses[200] = {
            description: 'Found user',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                            user: {
                                type: 'object',
                                properties: {
                                   _id: {
                                        type: 'string'
                                    },
                                    role: {
                                        type: 'string',
                                        enum: ['student','admin']
                                    },
                                    authenticationKey: {
                                        type: 'string'
                                    },
                                   password: {
                                        type: 'string'
                                    },
                                  
                                     email: {
                                        type: 'string'
                                    },
                                     registeredDate: {
                                        type: 'string'
                                    },
                                    lastlogindate: {
                                        type: 'string'
                                    },
                                }
                            }
                        }
                    },
                }
            }
        } 


         #swagger.responses[400] = {
            description: 'No found user',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                           
                        }
                    },
                }
            }
        } 
         #swagger.responses[500] = {
            description: 'Database Error',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                           
                        }
                    },
                }
            }
        } 
        */

    const authKey = req.params.authenticationkey;
    Users.getByAuthKey(authKey)
      .then((user) => {
        console.log(user);
        res.status(200).json({
          status: 200,
          message: "Found user by authenticationKey",
          user: user,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Failed to find user by authenticationKey / ${error}`,
        });
      });
  }
);

// Create admin
userController.post("/users/", auth(["admin"]), (req, res) => {
  /*
    #swagger.summary = 'Create user'
    #swagger.requestBody = {
        description: 'Create a new user account',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string'
                        },
                        password: {
                            type: 'string'
                        },
                        role: {
                            type: 'string',
                            enum: ['student', 'admin']
                        },
                    }
                },
                example: {
                    email: 'user@server.com',
                    password: 'abc123',
                    role:"admin"
                }
            }
        }
    } 
    #swagger.responses[200] = {
    description: 'User created',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    status: {
                        type: 'number'
                    },
                    message: {
                        type: 'string'
                    },
                    user: {
                        type: 'object',
                        properties: {
                           _id: {
                                        type: 'string'
                                    },
                                    role: {
                                        type: 'string',
                                        enum: ['student','admin']
                                    },
                                    authenticationKey: {
                                        type: 'string'
                                    },
                                   password: {
                                        type: 'string'
                                    },
                                  
                                     email: {
                                        type: 'string'
                                    },
                                     registeredDate: {
                                        type: 'string'
                                    },
                                    lastlogindate: {
                                        type: 'string'
                                    },
                        }
                    }
                }
            },
        }
    }
} 

    #swagger.responses[400] = {
        description: 'User has not been created',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                        
                    }
                },
            }
        }
} 
    #swagger.responses[500] = {
        description: 'Database error',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                       
                    }
                },
            }
        }
    } 

    
*/
  const userData = req.body;
  if (!userData.password.startsWith("$2a")) {
    userData.password = bcrypt.hashSync(userData.password);
  }

  const user = Users.Users(
    null,
    null,
    userData.password,
    userData.role,
    userData.email,
    userData.registeredDate,
    null
  );

  Users.create(user)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Created user",
        user: user,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: `Failed to create user /${error}`,
      });
    });
});

//Resisger user
userController.post("/users/register", (req, res) => {
  /* 
        #swagger.summary = 'Register user'
         #swagger.requestBody = {
            description: 'Register a new user account',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string'
                            },
                            password: {
                                type: 'string'
                            },
                        }
                    },
                }
            }
        } 
        #swagger.responses[200] = {
            description: 'User created',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                            user: {
                                type: 'object',
                                properties: {
                                       _id: {
                                        type: 'string'
                                    },
                                    role: {
                                        type: 'string',
                                        enum: ['student','admin']
                                    },
                                    authenticationKey: {
                                        type: 'string'
                                    },
                                   password: {
                                        type: 'string'
                                    },
                                  
                                     email: {
                                        type: 'string'
                                    },
                                     registeredDate: {
                                        type: 'string'
                                    },
                                    lastlogindate: {
                                        type: 'string'
                                    },
                                }
                            }
                        }
                    },
                }
            }
        } 

     #swagger.responses[400] = {
            description: 'Register user has not been implemented',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                        }
                    },
                }
            }
        } 

        #swagger.responses[500] = {
            description: 'Database error',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                        }
                    },
                }
            }
        } 
        */
  // Get the user data out of the request
  const userData = req.body;

  // hash the password
  userData.password = bcrypt.hashSync(userData.password);
  // Register date
  userData.registeredDate = new Date();

  // Convert the user data into an User model object
  const user = Users.Users(
    null,
    null,
    userData.password,
    "student",
    userData.email,
    userData.registeredDate,
    null
  );

  // Use the create model function to insert this user into the DB
  Users.create(user)
    //   You don't intend to use the resolved value, but you still need a callback function
    .then((_) => {
      res.status(200).json({
        status: 200,
        message: "Registration successful",
        user: user,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: `Registration failed / ${error}`,
      });
    });
});

// Update user
userController.options("/users/update", cors());
userController.patch(
  "/users/update",
  auth(["admin", "student"]),
  async (req, res) => {
    /*  #swagger.summary = 'Update user'
      #swagger.requestBody = {
        description: 'Update an existing user account',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        _id: {
                                        type: 'string'
                                    },
                                    role: {
                                        type: 'string',
                                        enum: ['student','admin']
                                    },
                                    authenticationKey: {
                                        type: 'string'
                                    },
                                   password: {
                                        type: 'string'
                                    },
                                  
                                     email: {
                                        type: 'string'
                                    },
                                     registeredDate: {
                                        type: 'string'
                                    },
                                    lastlogindate: {
                                        type: 'string'
                                    },
                    }
                },
                                    example:{
                                        id:"6510fbe823807bfe02c7e36b",                                        
                                        password:'abc123',
                                        email:'abc1234@hotmail.com',    
                                    }
            }
        }
    } 
    

     #swagger.responses[200] = {
        description: 'Updated user',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                        user: {
                            type: 'object',
                            properties: {
                                 _id: {
                                        type: 'string'
                                    },
                                    role: {
                                        type: 'string',
                                        enum: ['student','admin']
                                    },
                                    authenticationKey: {
                                        type: 'string'
                                    },
                                   password: {
                                        type: 'string'
                                    },
                                  
                                     email: {
                                        type: 'string'
                                    },
                                     registeredDate: {
                                        type: 'string'
                                    },
                                    lastlogindate: {
                                        type: 'string'
                                    },
                            }
                        }
                    }
                },
            }
        }
    }
     #swagger.responses[400] = {
        description: 'User has not been updated',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                      
                    }
                },
            }
        }
    } 
    #swagger.responses[500] = {
        description: 'Database error',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                        
                    }
                },
            }
        }
    } 

    */
    const userData = req.body;
    const newEmail = userData.email;
    if (userData.password && !userData.password.startsWith("$2a")) {
      //The 10 is the cost factor or the number of iterations used in the bcrypt hashing algorithm
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    console.log(userData);
    const existingUser = await Users.getByID(userData.id);
    console.log(existingUser);
    if (!existingUser) {
      res.status(400).json({
        status: 400,
        message: "User not found",
        user: null,
      });
      return;
    }

    const user = Users.Users(
      existingUser._id,
      existingUser.authenticationKey,
      userData.password,
      existingUser.role,
      userData.email,
      existingUser.registeredDate,
      existingUser.lastLoginDate
    );
    Users.updatePatch(user)
      .then((user) => {
        res.status(200).json({
          status: 200,
          message: "Updated user",
          user: user,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Failed to update user /${error.message}`,
        });
      });
  }
);
// update user using PUT
userController.options("/users/update/id", cors());
userController.put(
  "/users/update/id",
  auth(["admin", "student"]),
  async (req, res) => {
    /*  #swagger.summary = 'Update user'
      #swagger.requestBody = {
        description: 'Update an existing user account',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        _id: {
                                        type: 'string'
                                    },
                                    role: {
                                        type: 'string',
                                        enum: ['student','admin']
                                    },
                                    authenticationKey: {
                                        type: 'string'
                                    },
                                   password: {
                                        type: 'string'
                                    },
                                  
                                     email: {
                                        type: 'string'
                                    },
                                     registeredDate: {
                                        type: 'string'
                                    },
                                    lastlogindate: {
                                        type: 'string'
                                    },
                    }
                },
                                    example:{
                                        id:"6510fbe823807bfe02c7e36b",                                        
                                        password:'abc123',
                                        email:'abc1234@hotmail.com',    
                                    }
            }
        }
    } 
    

     #swagger.responses[200] = {
        description: 'Updated user',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                        user: {
                            type: 'object',
                            properties: {
                                 _id: {
                                        type: 'string'
                                    },
                                    role: {
                                        type: 'string',
                                        enum: ['student','admin']
                                    },
                                    authenticationKey: {
                                        type: 'string'
                                    },
                                   password: {
                                        type: 'string'
                                    },
                                  
                                     email: {
                                        type: 'string'
                                    },
                                     registeredDate: {
                                        type: 'string'
                                    },
                                    lastlogindate: {
                                        type: 'string'
                                    },
                            }
                        }
                    }
                },
            }
        }
    }
     #swagger.responses[400] = {
        description: 'User has not been updated',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                       
                    }
                },
            }
        }
    } 
    #swagger.responses[500] = {
        description: 'Database error',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                       
                    }
                },
            }
        }
    } 

    */
    const userData = req.body;
    if (userData.password && !userData.password.startsWith("$2a")) {
      //The 10 is the cost factor or the number of iterations used in the bcrypt hashing algorithm
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    // console.log(userData);
    const existingUser = await Users.getByID(userData.id);
    console.log(existingUser);
    if (!existingUser) {
      res.status(400).json({
        status: 400,
        message: "User not found",
        user: null,
      });
      return;
    }

    const user = Users.Users(
      existingUser._id,
      existingUser.authenticationKey,
      userData.password,
      existingUser.role,
      userData.email,
      existingUser.registeredDate,
      existingUser.lastLoginDate
    );
    Users.update(user)
      .then((user) => {
        res.status(200).json({
          status: 200,
          message: "Updated user",
          user: user,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Failed to update user /${error.message}`,
        });
      });
  }
);

//update users' role by date ranges
userController.patch("/users/role/update", (req, res) => {
  /*  #swagger.summary = 'Update users roles with registrated date'
        #swagger.requestBody = {
          description: 'Update an existing users role',
          content: {
              'application/json': {
                  schema: {
                      type: 'object',
                      properties: {
                          _id: {
                                          type: 'string'
                                      },
                                      role: {
                                          type: 'string',
                                          enum: ['student','admin']
                                      },
                                      authenticationKey: {
                                          type: 'string'
                                      },
                                     password: {
                                          type: 'string'
                                      },
                                    
                                       email: {
                                          type: 'string'
                                      },
                                       registeredDate: {
                                          type: 'string'
                                      },
                                      lastlogindate: {
                                          type: 'string'
                                      },
                      }
                  },
                                      example:{
                                          role:'student',
                                          startDate:'2023-09-10',
                                          endDate:'2023-09-11',    
                                      }
              }
          }
      } 
      
  
       #swagger.responses[200] = {
          description: 'Updated user role',
          content: {
              'application/json': {
                  schema: {
                      type: 'object',
                      properties: {
                          status: {
                              type: 'number'
                          },
                          message: {
                              type: 'string'
                          },
                          user: {
                              type: 'object',
                              properties: {
                                   _id: {
                                          type: 'string'
                                      },
                                      role: {
                                          type: 'string',
                                          enum: ['student','admin']
                                      },
                                      authenticationKey: {
                                          type: 'string'
                                      },
                                     password: {
                                          type: 'string'
                                      },
                                    
                                       email: {
                                          type: 'string'
                                      },
                                       registeredDate: {
                                          type: 'string'
                                      },
                                      lastlogindate: {
                                          type: 'string'
                                      },
                              }
                          }
                      }
                  },
              }
          }
      }
       #swagger.responses[400] = {
          description: 'User role has not been updated',
          content: {
              'application/json': {
                  schema: {
                      type: 'object',
                      properties: {
                          status: {
                              type: 'number'
                          },
                          message: {
                              type: 'string'
                          },
                        
                      }
                  },
              }
          }
      } 
      #swagger.responses[500] = {
          description: 'Database error',
          content: {
              'application/json': {
                  schema: {
                      type: 'object',
                      properties: {
                          status: {
                              type: 'number'
                          },
                          message: {
                              type: 'string'
                          },
                         
                      }
                  },
              }
          }
      } 
  
      */

  const role = req.body.role;
  console.log(req.body);
  const startDate = new Date(`${req.body.startDate}T00:00:00Z`);
  const endDate = new Date(`${req.body.endDate}T23:59:59Z`);

  Users.updateAccessLevel(role, startDate, endDate)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Update user role",
        role: role,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: `failed to update user role /${error}`,
      });
    });
});

//Delete user by ID
userController.options("/users/:id", cors());
userController.delete("/users/:id", auth(["admin"]), (req, res) => {
  /*
 #swagger.summary = 'Delete user by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        type: 'string'
    } 
    #swagger.responses[200] = {
        description: 'Deleted user',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                    }
                },
            }
        }
    } 

     #swagger.responses[400] = {
        description: 'User has not been deleted',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                    }
                },
            }
        }
    } 

     #swagger.responses[500] = {
        description: 'Database error',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                    }
                },
            }
        }
    } 
*/
  const userID = req.params.id;
  Users.deleteByID(userID)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Deleted user by userID",
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: `Failed to deleter user / ${error}`,
      });
    });
});

//Delete many users
userController.delete(
  "/users/students/:start_date/:end_date",
  auth(["admin"]),
  async (req, res) => {
    /*
   #swagger.summary = 'Delete multiple users by registered date range'
      #swagger.parameters['start_date'] = {
          in: 'path',
          description: 'start date',
          type: 'string'
      } 
       #swagger.parameters['end_date'] = {
          in: 'path',
          description: 'end date',
          type: 'string'
      } 
      #swagger.responses[200] = {
          description: 'Deleted users',
          content: {
              'application/json': {
                  schema: {
                      type: 'object',
                      properties: {
                          status: {
                              type: 'number'
                          },
                          message: {
                              type: 'string'
                          },
                      }
                  },
              }
          }
      } 
  
       #swagger.responses[400] = {
          description: 'Users have not been deleted',
          content: {
              'application/json': {
                  schema: {
                      type: 'object',
                      properties: {
                          status: {
                              type: 'number'
                          },
                          message: {
                              type: 'string'
                          },
                      }
                  },
              }
          }
      } 
  
       #swagger.responses[500] = {
          description: 'Database error',
          content: {
              'application/json': {
                  schema: {
                      type: 'object',
                      properties: {
                          status: {
                              type: 'number'
                          },
                          message: {
                              type: 'string'
                          },
                      }
                  },
              }
          }
      } 
  */

    // const startDate = new Date(req.params.start_date).toLocaleDateString();
    // const endDate = new Date(req.params.end_date).toLocaleDateString();
    const startDate = new Date(`${req.params.start_date}T00:00:00Z`);
    const endDate = new Date(`${req.params.end_date}T23:59:59Z`);

    Users.deleteManyStudents(startDate, endDate)
      .then((result) => {
        res.status(200).json({
          status: 200,
          message: `Deleted ${result.deletedCount}students who were resistered before ${endDate}`,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Failed to deleter students / ${error}`,
        });
      });
  }
);

export default userController;
