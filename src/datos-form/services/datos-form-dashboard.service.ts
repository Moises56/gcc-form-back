import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface FormsWithImagesResult {
  count: number;
}

@Injectable()
export class DatosFormDashboardService {
  constructor(private prisma: PrismaService) {}

  // Generate dashboard statistics
  async getDashboardStats() {
    try {
      // Total forms
      const totalForms = await this.prisma.datosForm.count();

      // Forms by month (last 6 months)
      const today = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 6);

      // For SQL Server
      const formsByMonth = await this.prisma.$queryRaw`
        SELECT 
          MONTH(fechaCreacion) AS month, 
          YEAR(fechaCreacion) AS year, 
          COUNT(*) as count 
        FROM DatosForm 
        WHERE fechaCreacion >= ${sixMonthsAgo}
        GROUP BY MONTH(fechaCreacion), YEAR(fechaCreacion)
        ORDER BY YEAR(fechaCreacion), MONTH(fechaCreacion)
      `;

      // Forms by user - we'll sort them after retrieving
      const formsByUser = await this.prisma.user.findMany({
        select: {
          id: true,
          fullName: true,
          username: true,
          _count: {
            select: {
              datosForm: true,
            },
          },
        },
      });
      
      // Sort by form count descending
      formsByUser.sort((a, b) => {
        return b._count.datosForm - a._count.datosForm;
      });
      
      // Take only the top 10
      const topUsers = formsByUser.slice(0, 10);

      // Areas with most forms
      const formsBySector = await this.prisma.datosForm.groupBy({
        by: ["sectorCatastral"],
        _count: {
          id: true
        },
        where: {
          sectorCatastral: {
            not: null,
          },
        },
        orderBy: {
          _count: {
            id: "desc"
          }
        },
        take: 10,
      });

      // Types of infractions summary - count for each infraction type
      const sinLicenciaConstruccionCount = await this.prisma.datosForm.count({
        where: { sinLicenciaConstruccion: true }
      });
      
      const obraInseguraPeligrosaCount = await this.prisma.datosForm.count({
        where: { obraInseguraPeligrosa: true }
      });
      
      const instalacionRotulosVallasCount = await this.prisma.datosForm.count({
        where: { instalacionRotulosVallas: true }
      });
      
      const construccionNoAutorizadaCount = await this.prisma.datosForm.count({
        where: { construccionNoAutorizada: true }
      });
      
      // Group the infractions data
      const infractions = {
        sinLicenciaConstruccion: sinLicenciaConstruccionCount,
        obraInseguraPeligrosa: obraInseguraPeligrosaCount,
        instalacionRotulosVallas: instalacionRotulosVallasCount,
        construccionNoAutorizada: construccionNoAutorizadaCount
      };

      // Forms with images - get a count of forms that have at least one image
      const formsWithImagesResult = await this.prisma.$queryRaw<FormsWithImagesResult[]>`
        SELECT COUNT(DISTINCT df.id) as count
        FROM DatosForm df
        JOIN ImagenForm img ON df.id = img.datosFormId
      `;
      
      // Extract the count value from the result
      const formsWithImages = formsWithImagesResult[0]?.count || 0;

      // Recent activity
      const recentActivity = await this.prisma.log.findMany({
        take: 10,
        orderBy: {
          fecha: "desc",
        },
        include: {
          user: {
            select: {
              fullName: true,
              username: true,
            },
          },
        },
      });

      return {
        totalForms,
        formsByMonth,
        formsByUser: topUsers,
        formsBySector,
        infractions,
        formsWithImages,
        formsWithoutImages: totalForms - formsWithImages,
        recentActivity,
      };
    } catch (error) {
      console.error("Error generating dashboard stats:", error);
      throw new Error("Error al generar estadísticas del dashboard");
    }
  }
}
