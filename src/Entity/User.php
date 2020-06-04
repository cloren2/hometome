<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @UniqueEntity(fields={"username"}, message="Ya hay una cuenta con ese usuario")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * 
     */
     
    private $username;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nombre;

    /**
     * @ORM\Column(type="string", length=40)
     */
    private $Apellidos;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Preferencias")
     */
    private $preferencias;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Ciudad")
     * @ORM\JoinColumn(nullable=false)
     */
    private $ciudad;

    /**
     * @ORM\Column(type="date")
     */
    private $fechaNac;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Foto")
     * @ORM\JoinColumn(name="foto_id", referencedColumnName="foto_id", onDelete="CASCADE")
     */
    private $foto;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Mensajes", mappedBy="sender_name")
     */
    private $mensajes;

    /**
     * @ORM\Column(type="string", length=2, nullable=true)
     */
    private $numRoomMates;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\Type(
     *     type="integer",
     *     message="El valor {{ value }} no es del {{ type }} válido."
     * )
     */
    private $precioMax;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $precioMin;

    /**
     * @ORM\Column(type="string", length=1, nullable=true)
     */
    private $genero;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $descripcion;

    public function __construct()
    {
        $this->preferencias = new ArrayCollection();
        $this->foto = new ArrayCollection();
        $this->mensajes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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
        return $this->Apellidos;
    }

    public function setApellidos(string $Apellidos): self
    {
        $this->Apellidos = $Apellidos;

        return $this;
    }

   /**
     * @return Collection|Foto[]
     */
    public function getFoto(): Collection
    {
        return $this->foto;
    }


    /**
     * @return Collection|Preferencias[]
     */
    public function getPreferencias(): Collection
    {
        return $this->preferencias;
    }

    public function addPreferencia(Preferencias $preferencia): self
    {
        if (!$this->preferencias->contains($preferencia)) {
            $this->preferencias[] = $preferencia;
        }

        return $this;
    }

    public function removePreferencia(Preferencias $preferencia): self
    {
        if ($this->preferencias->contains($preferencia)) {
            $this->preferencias->removeElement($preferencia);
        }

        return $this;
    }

    public function getCiudad(): ?Ciudad
    {
        return $this->ciudad;
    }

    public function setCiudad(?Ciudad $ciudad): self
    {
        $this->ciudad = $ciudad;

        return $this;
    }

    public function getFechaNac(): ?\DateTimeInterface
    {
        return $this->fechaNac;
    }

    public function setFechaNac(\DateTimeInterface $fechaNac): self
    {
        $this->fechaNac = $fechaNac;

        return $this;
    }

    public function addFoto(Foto $foto): self
    {
        if (!$this->foto->contains($foto)) {
            $this->foto[] = $foto;
        }

        return $this;
    }

    public function removeFoto(Foto $foto): self
    {
        if ($this->foto->contains($foto)) {
            $this->foto->removeElement($foto);
        }

        return $this;
    }

    /**
     * @return Collection|Mensajes[]
     */
    public function getMensajes(): Collection
    {
        return $this->mensajes;
    }

    public function addMensaje(Mensajes $mensaje): self
    {
        if (!$this->mensajes->contains($mensaje)) {
            $this->mensajes[] = $mensaje;
            $mensaje->setSenderName($this);
        }

        return $this;
    }

    public function removeMensaje(Mensajes $mensaje): self
    {
        if ($this->mensajes->contains($mensaje)) {
            $this->mensajes->removeElement($mensaje);
            // set the owning side to null (unless already changed)
            if ($mensaje->getSenderName() === $this) {
                $mensaje->setSenderName(null);
            }
        }

        return $this;
    }

    public function getNumRoomMates(): ?string
    {
        return $this->numRoomMates;
    }

    public function setNumRoomMates(?string $numRoomMates): self
    {
        $this->numRoomMates = $numRoomMates;

        return $this;
    }

    public function getPrecioMax(): ?int
    {
        return $this->precioMax;
    }

    public function setPrecioMax(?int $precioMax): self
    {
        $this->precioMax = $precioMax;

        return $this;
    }

    public function getPrecioMin(): ?int
    {
        return $this->precioMin;
    }

    public function setPrecioMin(?int $precioMin): self
    {
        $this->precioMin = $precioMin;

        return $this;
    }

    public function getGenero(): ?string
    {
        return $this->genero;
    }

    public function setGenero(?string $genero): self
    {
        $this->genero = $genero;

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
