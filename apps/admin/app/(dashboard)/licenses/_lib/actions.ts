"use server"

import type { License, Prisma } from "@openalternative/db"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { getErrorMessage } from "~/lib/handle-error"
import { prisma } from "~/services/prisma"

export async function createLicense(input: Prisma.LicenseCreateInput) {
  noStore()
  try {
    const license = await prisma.license.create({
      data: input,
    })

    revalidatePath("/licenses")

    return {
      data: license,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateLicense(id: string, input: Prisma.LicenseUpdateInput) {
  noStore()
  try {
    const license = await prisma.license.update({
      where: { id },
      data: input,
    })

    revalidatePath("/licenses")

    return {
      data: license,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateLicenses(input: {
  ids: License["id"][]
  data: Prisma.LicenseUpdateInput
}) {
  noStore()
  try {
    await prisma.license.updateMany({
      where: { id: { in: input.ids } },
      data: input.data,
    })

    revalidatePath("/licenses")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteLicense(input: { id: License["id"] }) {
  try {
    await prisma.license.delete({
      where: { id: input.id },
    })

    revalidatePath("/licenses")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteLicenses(input: { ids: License["id"][] }) {
  try {
    await prisma.license.deleteMany({
      where: { id: { in: input.ids } },
    })

    revalidatePath("/licenses")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
