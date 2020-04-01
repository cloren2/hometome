<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\RegistrationFormType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\User;
use App\Entity\Foto;
class HomeController extends AbstractController
{
    /**
     * @Route("/", name="home_index")
     */
    public function index()
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
    /**
     * @Route("/home", name="home_user")
     */
    public function home_user()
    {
        return $this->render('home/user.html.twig', [
            'controller_name' => 'HomeUserController',
        ]);
    }

    /**
     * @Route("/home/perfil", name="perfil_user")
     */
    public function perfil_user(Request $request): Response
    {
        $user = $this->getUser();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $fotoFile =  $form->get('foto')->getData();
            if ($fotoFile != null){
                $this->getDoctrine()->getManager()->flush();
                //$user->addFoto($f);
           // $foto=    $user->getFoto();
                self::renamePic($user,$fotoFile);
            } else {
             $this->getDoctrine()->getManager()->flush();
            }

            return $this->redirectToRoute('user_index');
        }

        return $this->render('user/perfil.html.twig', [
            'user' => $user,
            'registrationForm' => $form->createView(),
        ]);
    }
    private function renamePic(User $user, $fotoFile) {
        $foto = new Foto();
        $foto->setNombre($fotoFile->getClientOriginalName());
        $user->addFoto($foto);
        $entityManager = $this->getDoctrine()->getManager();
        foreach($foto as $f){
              $idFoto = $f->getId();
            
        $fileName ='img'.$user->getId().'-'.$idFoto.'.'.$f->guessExtension();
        $f-> move ('users/'.$user->getId(),$fileName);
        $user->addFoto($f);

        }
      
        //$user->setFoto($fileName);
        $entityManager->flush();
        return $user;
    }
}
