const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.addCompany = async (req, res) => {
  try {
    var data = req.body;
    var result = await prisma.company.create({
      data: {
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });
    res.status(200).send({ status: "OK", data: result });
  } catch (err) {
    res.status(200).send({ status: "ERROR", data: err });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      let result = await prisma.company.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          users: {
            where: {
              is_active: true,
            },
          },
        },
      });
      res.status(200).send({
        status: "OK",
        data: {
          ...result,
        },
      });
    } else {
      let result = await prisma.company.findMany({
        orderBy: [{ id: "desc" }],
      });
      res.status(200).send({
        status: "OK",
        data: {
          companyList: result,
        },
      });
    }
  } catch (err) {
    res.status(200).send({
      status: "ERROR",
      data: err,
    });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    let result = await prisma.company.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).send({ status: "OK", data: result });
  } catch (err) {
    res.status(200).send({
      status: "ERROR",
      data: err,
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    var data = req.body;
    var result = await prisma.company.update({
      where: {
        id: parseInt(data.companyId),
      },
      data: {
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });
    res.status(200).send({ status: "OK", data: result });
  } catch (err) {
    res.status(200).send({
      status: "OK",
      message: "Error while updating the record. please try again",
      data: err,
    });
  }
};

exports.addUserToCompany = async (req, res) => {
  try {
    var data = req.body;
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
    res.status(200).send({ status: "OK", data: result });
  } catch (err) {
    res.status(200).send({ status: "ERROR", data: err });
  }
};

exports.removeUserFromCompany = async (req, res) => {
  try {
    var data = req.body;
    var result = await prisma.company.update({
      where: {
        id: parseInt(data.companyId),
      },
      data: {
        users: {
          disconnect: {
            id: parseInt(data.userId),
          },
        },
      },
      include: {
        users: true,
      },
    });
    res.status(200).send({ status: "OK", data: result });
  } catch (err) {
    res.status(200).send({ status: "ERROR", data: err });
  }
};

exports.migrateUserToAnotherCompany = async (req, res) => {
  try {
    var data = req.body;
    await prisma.company.update({
      where: {
        id: parseInt(data.companyId),
      },
      data: {
        users: {
          disconnect: {
            id: parseInt(data.id),
          },
        },
      },
    });
    var result = await prisma.company.update({
      where: {
        id: parseInt(data.newCompanyId),
      },
      data: {
        users: {
          connect: {
            id: parseInt(data.id),
          },
        },
      },
      include: {
        users: true,
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
