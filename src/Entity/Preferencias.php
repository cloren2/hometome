<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PreferenciasRepository")
 */
class Preferencias
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="boolean")
     */
    private $fumador;

    /**
     * @ORM\Column(type="boolean")
     */
    private $mascotas;

    /**
     * @ORM\Column(type="boolean")
     */
    private $vidacomun;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $descripcion;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFumador(): ?bool
    {
        return $this->fumador;
    }

    public function setFumador(bool $fumador): self
    {
        $this->fumador = $fumador;

        return $this;
    }

    public function getMascotas(): ?bool
    {
        return $this->mascotas;
    }

    public function setMascotas(bool $mascotas): self
    {
        $this->mascotas = $mascotas;

        return $this;
    }

    public function getVidacomun(): ?bool
    {
        return $this->vidacomun;
    }

    public function setVidacomun(bool $vidacomun): self
    {
        $this->vidacomun = $vidacomun;

        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion): self
    {
        $this->descripcion = $descripcion;

        return $this;
    }
}
