// import mongo db
import { ObjectId } from "mongodb";
import { db } from "../database/mongodb.js";

export function Users(
  _id,
  authenticationKey,
  password,
  role,
  email,
  registeredDate,
  lastLoginDate
) {
  return {
    _id,
    authenticationKey,
    password,
    role,
    email,
    registeredDate,
    lastLoginDate,
  };
}

// Get all users
export async function getAll() {
  return db.collection("users").find().toArray();
}

//Create new user
export async function create(user) {
  delete user._id;
  return db.collection("users").insertOne(user);
}

// Get User by ID
export async function getByID(id) {
  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
  if (user) {
    return user;
  } else {
    return Promise.reject(`user is not founded with id ${id}`);
  }
}

// GET User by email
export async function getByEmail(email) {
  const user = await db.collection("users").findOne({ email: email });

  if (user) {
    return user;
  } else {
    return Promise.reject(`User is not found with email ${email}`);
  }
}

// GET User by authenticationkey
export async function getByAuthKey(authenticationKey) {
  let user = await db
    .collection("users")
    .findOne({ authenticationKey: authenticationKey });
  if (user) {
    return user;
  } else {
    return Promise.reject(
      `User is not found with AuthenticationKey ${authenticationKey}`
    );
  }
}
// update user patch
export async function updatePatch(user) {
  const userWithoutId = { ...user };
  delete userWithoutId._id;

  return db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(user._id) },
      { $set: { email: user.email, password: user.password } }
    );
}
//Update user put
export async function update(user) {
  const userWithoutId = { ...user };
  delete userWithoutId._id;

  return db
    .collection("users")
    .replaceOne({ _id: new ObjectId(user._id) }, userWithoutId);
}

//update user's role by date range
export async function updateAccessLevel(role, startDate, endDate) {
  return db
    .collection("users")
    .updateMany(
      {
        registeredDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
      {
        $set: {
          role: role,
        },
      }
    )
    .catch((error) => {
      console.log(error);
    });
}
//Delete user by ID
export async function deleteByID(id) {
  return db.collection("users").deleteOne({ _id: new ObjectId(id) });
}

export async function checkDeleteMany(startDate, endDate) {
  return db
    .collection("users")
    .find({
      role: "student",
      registeredDate: { $gte: startDate, $lte: endDate },
    })
    .toArray();
}
// Delete Many
export async function deleteManyStudents(startDate, endDate) {
  return db.collection("users").deleteMany({
    role: "student",
    registeredDate: { $gte: startDate, $lte: endDate },
  });
}
