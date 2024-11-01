import { SearchParams } from "@/app/product/utils/types";
import prisma from "@/libs/prismadb";

export async function getProducts(params: SearchParams) {
  const { category, search } = params;

  try {
    return await prisma.product.findMany({
      where: {
        ...(category && { category }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    throw new Error(
      "An error occurred while fetching products. Please try again later or contact support."
    );
  }
}

export async function getProductById(id: string) {
  try {
    return await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching product by id:", error);
  }
}

export async function getAllProducts() {
  try {
    return await prisma.product.findMany();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
