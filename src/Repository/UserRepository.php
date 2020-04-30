<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(UserInterface $user, string $newEncodedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', \get_class($user)));
        }

        $user->setPassword($newEncodedPassword);
        $this->_em->persist($user);
        $this->_em->flush();
    }

    // /**
    //  * @return User[] Returns an array of User objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    
    public function filtradoUsuarios($ciudad,$preferences, $gender,$roomMates,$min,$max,$idUserActivo)
    {
        $admin = $this->createQueryBuilder('admin')
        ->andWhere('admin.roles= :roles')
        ->setParameter('roles', '["ROLE_ADMIN"]')
        ->getQuery()
        ->getResult();
        if($gender=='N'){
            return $this->createQueryBuilder('u')
            ->join('u.preferencias', 'o')
            ->addSelect('o')
            ->where('o.id = :preferences')
            ->WHERE (
            'o.id IN (:preferences)')
            ->andWHERE (
                'u.id NOT IN (:admin)')
            ->andWHERE('u.id != :useractivo')
            ->andWHERE ('u.numRoomMates = :roomMates')
            ->andWHERE ('u.ciudad= :ciudad')
            ->andWHERE ('u.precioMin between :min and :max OR u.precioMax between :min and :max')
            
            ->setParameter('ciudad', $ciudad)
            ->setParameter('useractivo', $idUserActivo)
            ->setParameter('admin',$admin)
            ->setParameter('preferences',$preferences)
            ->setParameter('roomMates', $roomMates)
            ->setParameter('min', $min)
            ->setParameter('max', $max)
            ->getQuery()
            ->getResult()
            ;
        }else{
            return $this->createQueryBuilder('u')
            ->join('u.preferencias', 'o')
            ->addSelect('o')
            ->where('o.id = :preferences')
            ->WHERE (
            'o.id IN (:preferences)')
            ->andWHERE (
                'u.id NOT IN (:admin)')
            ->andWHERE('u.id != :useractivo')
            ->andWHERE ('u.numRoomMates = :roomMates')
            ->andWHERE ('u.ciudad= :ciudad')
            ->andWHERE ('u.precioMin between :min and :max OR u.precioMax between :min and :max')
            ->andWHERE ('u.genero = :gender')
            ->setParameter('ciudad', $ciudad)
            ->setParameter('useractivo', $idUserActivo)
            ->setParameter('admin',$admin)
            ->setParameter('preferences',$preferences)
            ->setParameter('roomMates', $roomMates)
            ->setParameter('gender', $gender)
            ->setParameter('min', $min)
            ->setParameter('max', $max)
            ->getQuery()
            ->getResult()
            ;
        }
    }   
}
