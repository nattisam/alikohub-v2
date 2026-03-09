import { PrismaClient } from '../../generated/client';

/**
 * Generates a unique code with the given prefix by checking for collisions
 * against the specified Prisma model field.
 *
 * @param prisma  - PrismaClient instance
 * @param model   - Prisma model delegate (e.g. prisma.booking)
 * @param field   - The unique field name to check against
 * @param prefix  - Code prefix (e.g. 'BK-ALC-')
 * @returns       - A guaranteed-unique code string
 */
export async function generateUniqueCode(
  prisma: PrismaClient,
  model: { findUnique: (args: any) => Promise<any> },
  field: string,
  prefix: string,
): Promise<string> {
  let code: string;
  let exists = true;

  while (exists) {
    code = `${prefix}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const existing = await model.findUnique({
      where: { [field]: code },
    });
    if (!existing) exists = false;
  }

  return code;
}
