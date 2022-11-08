const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.addUser = async (req, res) => {
  var data = req.body;
  var result = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      designation: data.designation,
      dob: new Date(data.dob),
    },
  });
  res.status(200).send(result);
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  if (id) {
    let result = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).send(result);
  } else {
    let result = await prisma.user.findMany();
    res.status(200).send(result);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  if (id) {
    try {
      let result = await prisma.user.update({
        data: {
          is_active: false,
        },
        where: {
          id: parseInt(id),
        },
      });
      res.status(200).send({
        status: "OK",
        message: "User deleted successfully.",
      });
    } catch (err) {
      res.status(200).send({
        status: "OK",
        message: "Record does not exist.",
      });
    }
  } else {
    res.status(200).send({
      status: "ERROR",
      message: "Please provide user id to delete",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    var data = req.body;
    let result = await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        designation: data.designation,
        dob: new Date(data.dob),
      },
    });
    res.status(200).send(result);
  } catch (err) {
    res.status(200).send({
      status: "OK",
      message: "Error while deleteing the record. please try again",
    });
  }
};
