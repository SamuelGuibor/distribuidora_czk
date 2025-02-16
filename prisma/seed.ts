// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // URLs de imagem para os produtos
    const images = [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150?text=Produto+2",
      "https://via.placeholder.com/150?text=Produto+3",
      "https://via.placeholder.com/150?text=Produto+4",
      "https://via.placeholder.com/150?text=Produto+5",
    ];

    // Nomes e descrições dos produtos
    const products = [
      {
        name: "Produto 1",
        description: "Descrição do Produto 1",
        price: "20.00",
        imageUrl: images[0],
      },
      {
        name: "Produto 2",
        description: "Descrição do Produto 2",
        price: "35.00",
        imageUrl: images[1],
      },
      {
        name: "Produto 3",
        description: "Descrição do Produto 3",
        price: "50.00",
        imageUrl: images[2],
      },
      {
        name: "Produto 4",
        description: "Descrição do Produto 4",
        price: "60.00",
        imageUrl: images[3],
      },
      {
        name: "Produto 5",
        description: "Descrição do Produto 5",
        price: "75.00",
        imageUrl: images[4],
      },
    ];

    // Criar produtos no banco de dados
    for (const product of products) {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
        },
      });
    }

    console.log("Produtos criados com sucesso!");
  } catch (error) {
    console.error("Erro ao criar os produtos:", error);
  } finally {
    await prisma.$disconnect(); // Garante que a conexão será fechada
  }
}

seedDatabase();
