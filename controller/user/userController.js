const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.addUser = async (req, res) => {
  try {
    var data = req.body;
    var result = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        designation: data.designation,
        dob: new Date(data.dob),
        companyId: data.companyId ? parseInt(data.companyId) : null,
      },
    });
    res.status(200).send({
      status: "OK",
      data: result,
    });
  } catch (err) {
    res.status(200).send({
      status: "ERROR",
      data: err,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      let result = await prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          company: true,
        },
      });
      res.status(200).send({ status: "OK", data: result });
    } else {
      let result = await prisma.user.findMany({
        orderBy: [{ id: "desc" }],
        include: { company: true },
      });
      res.status(200).send({
        status: "OK",
        data: {
          users: result,
        },
      });
    }
  } catch (err) {
    res.status(200).send({
      status: "ERROR",
      message: "Error while fetching user. Please try again.",
      data: err,
    });
  }
};

exports.changeUserActiveStatus = async (req, res) => {
  try {
    const data = req.body;
    var result = await prisma.user.update({
      where: {
        id: parseInt(data.id),
      },
      data: {
        is_active: data.status,
      },
    });
    res.status(200).send({
      status: "OK",
      message: "User deactivated successfully.",
      data: result,
    });
  } catch (err) {
    res.status(200).send({
      status: "ERROR",
      message: "Error while deactivating user. Please try again.",
      data: err,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  if (id) {
    try {
      var result = await prisma.user.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.status(200).send({
        status: "OK",
        message: "User deleted successfully.",
        data: result,
      });
    } catch (err) {
      res.status(200).send({
        status: "ERROR",
        message: "Error while deleted user. Please try again.",
        data: err,
      });
    }
  } else {
    res.status(200).send({
      status: "ERROR",
      message: "Please provide valid user id.",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    var data = req.body;
    let result = await prisma.user.update({
      where: {
        id: parseInt(data.id),
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        designation: data.designation,
        dob: new Date(data.dob),
        companyId: data.companyId ? parseInt(data.companyId) : null,
      },
    });
    res.status(200).send({
      status: "OK",
      data: result,
    });
  } catch (err) {
    res.status(200).send({
      status: "ERROR",
      data: err,
      message: "Error while deleteing the record. please try again",
    });
  }
};
