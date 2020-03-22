<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200322113921 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE ciudad (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user ADD ciudad_id INT NOT NULL, DROP ciudad, CHANGE fecha_nac fecha_nac DATETIME DEFAULT NULL, CHANGE fumador fumador TINYINT(1) DEFAULT NULL, CHANGE mascotas mascotas TINYINT(1) DEFAULT NULL, CHANGE nmaxcomp nmaxcomp INT DEFAULT NULL, CHANGE vidacomun vidacomun TINYINT(1) DEFAULT NULL, CHANGE descripcion descripcion VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649E8608214 FOREIGN KEY (ciudad_id) REFERENCES ciudad (id)');
        $this->addSql('CREATE INDEX IDX_8D93D649E8608214 ON user (ciudad_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649E8608214');
        $this->addSql('DROP TABLE ciudad');
        $this->addSql('DROP INDEX IDX_8D93D649E8608214 ON user');
        $this->addSql('ALTER TABLE user ADD ciudad VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, DROP ciudad_id, CHANGE fecha_nac fecha_nac DATETIME DEFAULT \'NULL\', CHANGE fumador fumador TINYINT(1) DEFAULT \'NULL\', CHANGE mascotas mascotas TINYINT(1) DEFAULT \'NULL\', CHANGE nmaxcomp nmaxcomp INT DEFAULT NULL, CHANGE vidacomun vidacomun TINYINT(1) DEFAULT \'NULL\', CHANGE descripcion descripcion VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
    }
}
