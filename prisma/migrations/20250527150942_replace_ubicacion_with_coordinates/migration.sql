/*
  Warnings:

  - You are about to drop the column `ubicacion` on the `DatosForm` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- Add new columns first
ALTER TABLE [dbo].[DatosForm] ADD [latitud] FLOAT(53),
[longitud] FLOAT(53);

-- Now drop the old column
ALTER TABLE [dbo].[DatosForm] DROP COLUMN [ubicacion];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
