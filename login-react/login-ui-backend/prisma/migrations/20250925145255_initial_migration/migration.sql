-- CreateTable
CREATE TABLE `Building` (
    `idBuilding` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `lat` FLOAT NOT NULL,
    `long` FLOAT NOT NULL,
    `territory_id` MEDIUMINT UNSIGNED NULL,
    `last_modified` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `address` VARCHAR(255) NULL,
    `updatedAt` TIMESTAMP(0) NULL,

    INDEX `idTerritory_idx`(`territory_id`),
    PRIMARY KEY (`idBuilding`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Congregation` (
    `idCongregation` MEDIUMINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NULL,
    `language` VARCHAR(100) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL,

    PRIMARY KEY (`idCongregation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Door` (
    `idDoor` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `language` VARCHAR(100) NULL,
    `information_name` TEXT NULL,
    `building_id` INTEGER UNSIGNED NULL,
    `id_cong_app` MEDIUMINT UNSIGNED NOT NULL,
    `id_cong_lang` INTEGER UNSIGNED NOT NULL,
    `lastModified` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL,

    INDEX `idBuilding_idx`(`building_id`),
    INDEX `id_cong_app_idx`(`id_cong_app`),
    INDEX `id_cong_lang_idx`(`id_cong_lang`),
    PRIMARY KEY (`idDoor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Language` (
    `idLanguage` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_cong_app` MEDIUMINT UNSIGNED NOT NULL,
    `id_cong_lang` MEDIUMINT UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `Color` TINYINT UNSIGNED NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL,

    INDEX `id_cong_app_idx`(`id_cong_app`),
    PRIMARY KEY (`idLanguage`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Publisher` (
    `idPublisher` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `congregation_id` MEDIUMINT UNSIGNED NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL,

    INDEX `idCongregation_idx`(`congregation_id`),
    PRIMARY KEY (`idPublisher`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Territory` (
    `idTerritory` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `congregation_id` MEDIUMINT UNSIGNED NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL,

    INDEX `idCongregation_idx`(`congregation_id`),
    PRIMARY KEY (`idTerritory`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `App1Entry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_cong` INTEGER NOT NULL,
    `Gps` VARCHAR(191) NOT NULL,
    `Landmark` VARCHAR(191) NOT NULL,
    `Territory` VARCHAR(191) NOT NULL,
    `Url` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Login` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NULL,
    `googleSignIn` BOOLEAN NOT NULL DEFAULT false,
    `whatsapp` VARCHAR(20) NOT NULL,
    `congregationNumber` MEDIUMINT UNSIGNED NOT NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,
    `loginCount` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Login_email_key`(`email`),
    INDEX `Login_cong_idx`(`congregationNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `whatsapp` VARCHAR(20) NOT NULL,
    `congregationNumber` MEDIUMINT UNSIGNED NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Invite_cong_idx`(`congregationNumber`),
    INDEX `Invite_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Building` ADD CONSTRAINT `idTerritory` FOREIGN KEY (`territory_id`) REFERENCES `Territory`(`idTerritory`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Door` ADD CONSTRAINT `idBuilding` FOREIGN KEY (`building_id`) REFERENCES `Building`(`idBuilding`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Door` ADD CONSTRAINT `id_cong_app1` FOREIGN KEY (`id_cong_app`) REFERENCES `Congregation`(`idCongregation`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Door` ADD CONSTRAINT `id_cong_lang` FOREIGN KEY (`id_cong_lang`) REFERENCES `Language`(`idLanguage`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Language` ADD CONSTRAINT `id_cong_app` FOREIGN KEY (`id_cong_app`) REFERENCES `Congregation`(`idCongregation`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Publisher` ADD CONSTRAINT `idCongregation2` FOREIGN KEY (`congregation_id`) REFERENCES `Congregation`(`idCongregation`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Territory` ADD CONSTRAINT `idCongregation` FOREIGN KEY (`congregation_id`) REFERENCES `Congregation`(`idCongregation`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Login` ADD CONSTRAINT `LoginToCongregation` FOREIGN KEY (`congregationNumber`) REFERENCES `Congregation`(`idCongregation`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Invite` ADD CONSTRAINT `InviteToCongregation` FOREIGN KEY (`congregationNumber`) REFERENCES `Congregation`(`idCongregation`) ON DELETE CASCADE ON UPDATE NO ACTION;
