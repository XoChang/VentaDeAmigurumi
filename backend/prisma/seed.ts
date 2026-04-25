import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const configCount = await prisma.config.count();
  if (configCount === 0) {
    await prisma.config.create({
      data: {
        whatsappNumber: process.env.DEFAULT_WHATSAPP ?? "",
        storeName: "AmigurumiShop",
        currencySymbol: "S/.",
      },
    });
    console.log("Config singleton creado.");
  }

  if (process.env.NODE_ENV !== "production") {
    const productCount = await prisma.product.count();
    if (productCount === 0) {
      await prisma.product.createMany({
        data: [
          {
            name: "Pikachu",
            price: 35,
            category: "ANIME",
            description: "Amigurumi de Pikachu tejido a crochet, aprox. 20cm de alto",
            imageUrl: "https://placehold.co/400x400/FFD700/333?text=Pikachu+⚡",
            available: true,
          },
          {
            name: "Osito Café",
            price: 25,
            category: "ANIMALS",
            description: "Oso de peluche tejido a mano, 15cm, suavísimo",
            imageUrl: "https://placehold.co/400x400/D2691E/FFF?text=Osito+🐻",
            available: true,
          },
          {
            name: "Totoro",
            price: 45,
            category: "ANIME",
            description: "Mi Vecino Totoro, 25cm, perfecto para regalar",
            imageUrl: "https://placehold.co/400x400/808080/FFF?text=Totoro+🌳",
            available: true,
          },
          {
            name: "Conejo Rosado",
            price: 30,
            category: "ANIMALS",
            description: "Conejito adorable de 18cm, ideal para bebés",
            imageUrl: "https://placehold.co/400x400/FFB6C1/333?text=Conejito+🐰",
            available: true,
          },
          {
            name: "Naruto",
            price: 40,
            category: "ANIME",
            description: "Naruto Uzumaki con su traje naranja, 22cm",
            imageUrl: "https://placehold.co/400x400/FF8C00/FFF?text=Naruto+🍜",
            available: true,
          },
          {
            name: "Pato Amarillo",
            price: 20,
            category: "ANIMALS",
            description: "Patito de crochet, 12cm, muy tierno",
            imageUrl: "https://placehold.co/400x400/FFD700/333?text=Patito+🦆",
            available: false,
          },
        ],
      });
      console.log("Productos de ejemplo creados.");
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
