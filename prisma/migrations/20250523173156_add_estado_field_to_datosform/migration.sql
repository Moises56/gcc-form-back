BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DatosForm] ADD [estado] NVARCHAR(1000) NOT NULL CONSTRAINT [DatosForm_estado_df] DEFAULT 'ACTIVO';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
