const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanup() {
  try {
    // Eliminar usuario de prueba
    await prisma.user.deleteMany({
      where: {
        username: 'testuser123'
      }
    });
    
    console.log('Usuario de prueba eliminado exitosamente');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
