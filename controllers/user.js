const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const awsUploadImage = require("../utils/aws-upload-image");

const UserController = {

  register: async function(input) {
    const newUser = input;
    newUser.email = newUser.email.toLowerCase();
    newUser.username = newUser.username.toLowerCase();

    const { email, username, password } = newUser;

    // Revisamos si el email esta en uso
    const foundEmail = await User.findOne({ email });
    if (foundEmail) throw new Error("El email ya esta en uso");

    // Revisamos si el username esta en uso
    const foundUsername = await User.findOne({ username });
    if (foundUsername) throw new Error("El nombre de usuario ya esta en uso");

    // Encriptar
    const salt = await bcryptjs.genSaltSync(10);
    newUser.password = await bcryptjs.hash(password, salt);

    try {
      const user = new User(newUser);
      user.save();
      return user;
    } catch (error) {
      console.log(error);
    }
  },

  login: async function(input) {
    const { email, password } = input;

    const userFound = await User.findOne({ email: email.toLowerCase() });
    if (!userFound) throw new Error("Error en el email o contraseña");

    const passwordSucess = await bcryptjs.compare(password, userFound.password);
    if (!passwordSucess) throw new Error("Error en el email o contraseña");

    return {
      token: createToken(userFound, process.env.SECRET_KEY, "24h"),
    };
  },

  getUser: async function(id, username) {
    let user = null;
    if (id) user = await User.findById(id);
    if (username) user = await User.findOne({ username });
    if (!user) throw new Error("El usuario no existe");

    return user;
  },

  updateAvatar: async function(file,ctx) {
    const {id} = ctx.user;
    const {mimetype, createReadStream} = await file;
    const extension = mimetype.split("/")[1];
    const imageName = `avatar/${id}.${extension}`;
    const fileData = createReadStream();

    try {
      const result = await awsUploadImage(fileData,imageName);
      const update = await User.findByIdAndUpdate(id,{avatar: result});
      return {status: true, urlAvatar: result};
    } catch (error) {
      return {
        status: false,
        urlAvatar: null
      };
    }
  },

  deleteAvatar: async function(ctx) {
    const {id} = ctx.user;
    try {
      await User.findByIdAndUpdate(id,{avatar:''});
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  updateUser: async function(input, ctx) {
    const { id } = ctx.user;

    try {
      if (input.currentPassword && input.newPassword) {
        const userFound = await User.findById(id);
        const passwordSuccess = await bcryptjs.compare(
          input.currentPassword,
          userFound.password
        );

        if (!passwordSuccess) throw new Error("Contraseña incorrecta");

        const salt = await bcryptjs.genSaltSync(10);
        const newPasswordCrypt = await bcryptjs.hash(input.newPassword, salt);

        await User.findByIdAndUpdate(id, { password: newPasswordCrypt });
      } else {
        await User.findByIdAndUpdate(id, input);
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  search: async function(search) {
    const users = await User.find({
      name: {$regex: search, $options: 'i'}
    });
    return users;
  }
}
module.exports = UserController;

function createToken(user, SECRET_KEY, expiresIn) {
  const { id, name, email, username } = user;
  const payload = {
    id,
    name,
    email,
    username,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}
