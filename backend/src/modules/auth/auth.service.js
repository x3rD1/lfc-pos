const prisma = require("../../../lib/prisma");
const bcrypt = require("bcryptjs");

exports.signup = async ({ company, email, password }) => {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ company }, { email }] },
  });

  if (existingUser) {
    if (existingUser.company === company)
      throw new Error("COMPANY_ALREADY_EXISTS");
    if (existingUser.email === email) throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { company, email, password: hashedPassword },
  });
};
