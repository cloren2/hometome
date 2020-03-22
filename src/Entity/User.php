<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nombre;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $apellidos;

    /**
     * @ORM\Column(type="integer")
     */
    private $telefono;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $pass;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $foto;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $fechaNac;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $ciudad;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $fumador;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $mascotas;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $nmaxcomp;

    /**
     * @ORM\Column(type="boolean", nullable=true)
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

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): self
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getApellidos(): ?string
    {
        return $this->apellidos;
    }

    public function setApellidos(string $apellidos): self
    {
        $this->apellidos = $apellidos;

        return $this;
    }

    public function getTelefono(): ?int
    {
        return $this->telefono;
    }

    public function setTelefono(int $telefono): self
    {
        $this->telefono = $telefono;

        return $this;
    }

    public function getPass(): ?string
    {
        return $this->pass;
    }

    public function setPass(string $pass): self
    {
        $this->pass = $pass;

        return $this;
    }

    public function getFoto(): ?string
    {
        return $this->foto;
    }

    public function setFoto(string $foto): self
    {
        $this->foto = $foto;

        return $this;
    }

    public function getFechaNac(): ?\DateTimeInterface
    {
        return $this->fechaNac;
    }

    public function setFechaNac(?\DateTimeInterface $fechaNac): self
    {
        $this->fechaNac = $fechaNac;

        return $this;
    }

    public function getCiudad(): ?string
    {
        return $this->ciudad;
    }

    public function setCiudad(?string $ciudad): self
    {
        $this->ciudad = $ciudad;

        return $this;
    }

    public function getFumador(): ?bool
    {
        return $this->fumador;
    }

    public function setFumador(?bool $fumador): self
    {
        $this->fumador = $fumador;

        return $this;
    }

    public function getMascotas(): ?bool
    {
        return $this->mascotas;
    }

    public function setMascotas(?bool $mascotas): self
    {
        $this->mascotas = $mascotas;

        return $this;
    }

    public function getNmaxcomp(): ?int
    {
        return $this->nmaxcomp;
    }

    public function setNmaxcomp(?int $nmaxcomp): self
    {
        $this->nmaxcomp = $nmaxcomp;

        return $this;
    }

    public function getVidacomun(): ?bool
    {
        return $this->vidacomun;
    }

    public function setVidacomun(?bool $vidacomun): self
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
