<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MensajesRepository")
 */
class Mensajes
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $reciever_name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $message;

    /**
     * @ORM\Column(type="boolean")
     */
    private $status;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="mensajes")
     * @ORM\JoinColumn(nullable=false)
     */
    private $sender_name;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSenderName(): ?User
    {
        return $this->sender_name;
    }

    public function setSenderName(User $sender_name): self
    {
        $this->sender_name = $sender_name;

        return $this;
    }

    public function getRecieverName(): ?string
    {
        return $this->reciever_name;
    }

    public function setRecieverName(string $reciever_name): self
    {
        $this->reciever_name = $reciever_name;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    public function getStatus(): ?bool
    {
        return $this->status;
    }

    public function setStatus(bool $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }
}
