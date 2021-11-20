import bcrypt from 'bcryptjs';

export async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export async function comparePasswords(password, hash) {
    const result = await bcrypt.compare(password, hash);
    return result;
}