<?php

namespace App\Repository;

use App\Entity\Preferencias;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Preferencias|null find($id, $lockMode = null, $lockVersion = null)
 * @method Preferencias|null findOneBy(array $criteria, array $orderBy = null)
 * @method Preferencias[]    findAll()
 * @method Preferencias[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PreferenciasRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Preferencias::class);
    }

     /**
      * @return Preferencias[] Returns an array of Preferencias objects
     */
    
    public function buscadorPreferencias($search)
    {
        return $this->createQueryBuilder('a')
        ->andWhere('a.nombre LIKE :val')
        ->setParameter('val','%'.$search.'%') 
         ->getQuery()
         ->getResult()
         ;
        ;
    }
    

    /*
    public function findOneBySomeField($value): ?Preferencias
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
