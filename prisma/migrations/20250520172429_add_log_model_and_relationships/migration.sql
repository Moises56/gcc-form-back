BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Log] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [accion] NVARCHAR(1000) NOT NULL,
    [descripcion] NVARCHAR(1000),
    [entidad] NVARCHAR(1000) NOT NULL,
    [fecha] DATETIME2 NOT NULL CONSTRAINT [Log_fecha_df] DEFAULT CURRENT_TIMESTAMP,
    [userId] UNIQUEIDENTIFIER NOT NULL,
    [datosFormId] INT,
    CONSTRAINT [Log_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DatosForm] (
    [id] INT NOT NULL IDENTITY(1,1),
    [numeroNota] NVARCHAR(1000),
    [fechaCreacion] DATETIME2 CONSTRAINT [DatosForm_fechaCreacion_df] DEFAULT CURRENT_TIMESTAMP,
    [userId] UNIQUEIDENTIFIER NOT NULL,
    [propietario] NVARCHAR(1000),
    [direccionObra] NVARCHAR(1000),
    [sectorCatastral] NVARCHAR(1000),
    [fechaInspeccion] DATETIME2,
    [areaPrivada] BIT CONSTRAINT [DatosForm_areaPrivada_df] DEFAULT 0,
    [areaUsoPublico] BIT CONSTRAINT [DatosForm_areaUsoPublico_df] DEFAULT 0,
    [sinLicenciaConstruccion] BIT CONSTRAINT [DatosForm_sinLicenciaConstruccion_df] DEFAULT 0,
    [obraInseguraPeligrosa] BIT CONSTRAINT [DatosForm_obraInseguraPeligrosa_df] DEFAULT 0,
    [instalacionRotulosVallas] BIT CONSTRAINT [DatosForm_instalacionRotulosVallas_df] DEFAULT 0,
    [construccionNoAutorizada] BIT CONSTRAINT [DatosForm_construccionNoAutorizada_df] DEFAULT 0,
    [construccionAreaPublica] BIT CONSTRAINT [DatosForm_construccionAreaPublica_df] DEFAULT 0,
    [instalacionAntena] BIT CONSTRAINT [DatosForm_instalacionAntena_df] DEFAULT 0,
    [cambioUsoNoAutorizado] BIT CONSTRAINT [DatosForm_cambioUsoNoAutorizado_df] DEFAULT 0,
    [utilizaAreaPublicaMaterial] BIT CONSTRAINT [DatosForm_utilizaAreaPublicaMaterial_df] DEFAULT 0,
    [instalacionPostes] BIT CONSTRAINT [DatosForm_instalacionPostes_df] DEFAULT 0,
    [licenciaVencida] BIT CONSTRAINT [DatosForm_licenciaVencida_df] DEFAULT 0,
    [roturaViaBordillo] BIT CONSTRAINT [DatosForm_roturaViaBordillo_df] DEFAULT 0,
    [otroTipoInfraccion] NVARCHAR(1000),
    [fechaCita] DATETIME2,
    [usoSueloHabitacional] BIT CONSTRAINT [DatosForm_usoSueloHabitacional_df] DEFAULT 0,
    [usoSueloComercial] BIT CONSTRAINT [DatosForm_usoSueloComercial_df] DEFAULT 0,
    [usoSueloEquipamiento] BIT CONSTRAINT [DatosForm_usoSueloEquipamiento_df] DEFAULT 0,
    [usoSueloServicios] BIT CONSTRAINT [DatosForm_usoSueloServicios_df] DEFAULT 0,
    [usoSueloProductivo] BIT CONSTRAINT [DatosForm_usoSueloProductivo_df] DEFAULT 0,
    [usoSueloOtro] NVARCHAR(1000),
    [areaEstimada] FLOAT(53),
    [niveles] INT,
    [sotanos] INT,
    [materiales] NVARCHAR(1000),
    [faseObra] FLOAT(53),
    [costoAproximado] FLOAT(53),
    [tipoRotuloValla] NVARCHAR(1000),
    [empresa] NVARCHAR(1000),
    [tipoRotura] NVARCHAR(1000),
    [cantidadPostesAntenas] INT,
    [faseObraDescripcion] NVARCHAR(1000),
    [descripcionOtro] NVARCHAR(1000),
    [numeroExpediente] NVARCHAR(1000),
    [numeroLicencia] NVARCHAR(1000),
    [fechaAutorizacion] DATETIME2,
    [fechaVencimiento] DATETIME2,
    [observaciones] NVARCHAR(1000),
    [reciboNombreFirma] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DatosForm_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [DatosForm_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Log] ADD CONSTRAINT [Log_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Log] ADD CONSTRAINT [Log_datosFormId_fkey] FOREIGN KEY ([datosFormId]) REFERENCES [dbo].[DatosForm]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DatosForm] ADD CONSTRAINT [DatosForm_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
