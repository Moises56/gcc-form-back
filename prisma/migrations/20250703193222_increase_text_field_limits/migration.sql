BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DatosForm] ALTER COLUMN [observaciones] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[DatosForm] ALTER COLUMN [Articulo1] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[DatosForm] ALTER COLUMN [descripcionAvance] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[DatosForm] ALTER COLUMN [descripcionGeneral] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[DatosForm] ALTER COLUMN [notaUrgente] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[DatosForm] ALTER COLUMN [recomendacion] NVARCHAR(max) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
