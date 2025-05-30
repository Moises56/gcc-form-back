BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DatosForm] ADD [descripcionAvance] NVARCHAR(1000),
[descripcionGeneral] NVARCHAR(1000),
[notaUrgente] NVARCHAR(1000),
[recomendacion] NVARCHAR(1000),
[tipoObra] NVARCHAR(1000),
[usoEspecifico] NVARCHAR(1000),
[zonificacion] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
