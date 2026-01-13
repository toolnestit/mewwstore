import bcrypt from "bcryptjs";

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let segment = () =>
    Array.from(
      { length: 4 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");

  return `${segment()}${segment()}${segment()}`;
}

export async function createSecurePassword() {
  const rawPassword = generateCode();
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  return { rawPassword, hashedPassword };
}

export async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
