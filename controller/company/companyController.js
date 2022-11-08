const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.addCompany = async (req, res) => {
  var data = req.body;
  if (
    !data.companyName ||
    !data.companyAddress ||
    !data.latitude ||
    !data.longitude
  ) {
    res.status(200).send({
      status: "ERROR",
      message: "Some fields are missing",
      data: data,
    });
  }
  var result = await prisma.company.create({
    data: {
      companyName: req.body.companyName,
      companyAddress: req.body.companyAddress,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    },
  });
  res.status(200).send(result);
};

exports.getCompany = async (req, res) => {
  const { id } = req.params;
  if (id) {
    let result = await prisma.company.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        users: true,
      },
    });
    res.status(200).send(result);
  } else {
    let result = await prisma.company.findMany();
    res.status(200).send(result);
  }
};

exports.deleteCompany = async (req, res) => {
  const { id } = req.params;
  if (id) {
    try {
      let result = await prisma.company.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.status(200).send(result);
    } catch (err) {
      res.status(200).send({
        status: "OK",
        message: "Record does not exist.",
      });
    }
  } else {
    res.status(200).send({
      status: "ERROR",
      message: "Please provide company id to delete",
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    let result = await prisma.company.update({
      where: {
        id: req.body.id,
      },
      data: {
        companyName: req.body.companyName,
        companyAddress: req.body.companyAddress,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
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

exports.addUserToCompany = async (req, res) => {
  var data = req.body;
  try {
    var result = await prisma.company.update({
      where: {
        id: data.companyId,
      },
      data: {
        users: {
          connect: {
            id: data.userId,
          },
        },
      },
      include: {
        users: true,
      },
    });
    res.status(200).send(result);
  } catch (err) {
    res.status(200).send(err);
  }
};

exports.removeUserFromCompany = async (req, res) => {
  var data = req.body;
  try {
    var result = await prisma.company.update({
      where: {
        id: data.companyId,
      },
      data: {
        users: {
          disconnect: {
            id: data.userId,
          },
        },
      },
      include: {
        users: true,
      },
    });
    res.status(200).send(result);
  } catch (err) {
    res.status(200).send(err);
  }
};

exports.migrateUserToAnotherCompany = async (req, res) => {
  var data = req.body;
  try {
    await prisma.company.update({
      where: {
        id: data.companyId,
      },
      data: {
        users: {
          disconnect: {
            id: data.userId,
          },
        },
      },
    });
    var result = await prisma.company.update({
      where: {
        id: data.newCompanyId,
      },
      data: {
        users: {
          connect: {
            id: data.userId,
          },
        },
      },
      include: {
        users: true,
      },
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(200).send(err);
  }
};
