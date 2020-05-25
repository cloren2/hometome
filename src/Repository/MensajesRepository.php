<?php

namespace App\Repository;

use App\Entity\Mensajes;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Mensajes|null find($id, $lockMode = null, $lockVersion = null)
 * @method Mensajes|null findOneBy(array $criteria, array $orderBy = null)
 * @method Mensajes[]    findAll()
 * @method Mensajes[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MensajesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Mensajes::class);
    }

    /**
     * @return Mensajes[] Returns an array of Mensajes objects
     */
    public function chatConversation($sender)
    {
        return $this->createQueryBuilder('m')
            ->where('m.sender_name=:val')
            ->groupBy('m.reciever_name')
            ->setParameter('val', $sender)
            ->orderBy('m.id', 'ASC')
            ->getQuery()
            ->getResult();
    }
    /**
     * @return Mensajes[] Returns an array of Mensajes objects
     */
    public function lastMessage($sender)
    {
        return $this->createQueryBuilder('m')
            ->where('m.sender_name=:val')
            ->groupBy('m.reciever_name')
            ->setParameter('val', $sender)
            ->orderBy('m.id', 'DES')
            ->setMaxResults(1)
            ->getQuery()
            ->getResult();
    }    
    /**
     * @return Mensajes[] Returns an array of Mensajes objects
     */
    public function chatSender($sender, $reciever)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.sender_name = :val or m.sender_name = :val2')
            ->setParameter('val', $sender)
            ->andWhere('m.reciever_name= :val2 or m.reciever_name= :val')
            ->setParameter('val2', $reciever)
            ->orderBy('m.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function modifyStatus($idMensajes)
    {
        //forearch id
        return $this->createQueryBuilder('m')
            ->update('Mensajes')
            ->set('status', 'false')
            ->where('m.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();
    }
    /*
    public function findOneBySomeField($value): ?Mensajes
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
