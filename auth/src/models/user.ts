import mongoose from "mongoose";

// An interface rhat descrives the properties
// that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface rhat descrives the properties
// that that the User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface rhat descrives the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String, //String with S in capital references to mongoDB
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
